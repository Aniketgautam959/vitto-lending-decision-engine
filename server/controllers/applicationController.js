/**
 * applicationController.js
 */

const Application = require('../models/Application');
const { evaluateApplication } = require('../services/decisionEngine');

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const submitApplication = async (req, res) => {
  try {
    const { name, pan, monthlyRevenue, loanAmount, tenure } = req.body;
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push('Name is required.');
    }

    if (!pan) {
      errors.push('PAN is required.');
    } else if (!PAN_REGEX.test(pan.trim().toUpperCase())) {
      errors.push('Invalid PAN format.');
    }

    const parsedRevenue = parseFloat(monthlyRevenue);
    if (!monthlyRevenue || isNaN(parsedRevenue) || parsedRevenue <= 0) {
      errors.push('Monthly revenue must be a positive number.');
    }

    const parsedLoanAmount = parseFloat(loanAmount);
    if (!loanAmount || isNaN(parsedLoanAmount) || parsedLoanAmount <= 0) {
      errors.push('Loan amount must be a positive number.');
    }

    const parsedTenure = parseInt(tenure, 10);
    if (!tenure || isNaN(parsedTenure) || parsedTenure <= 0) {
      errors.push('Tenure must be a positive integer.');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const decisionResult = evaluateApplication({
      monthlyRevenue: parsedRevenue,
      loanAmount: parsedLoanAmount,
      tenure: parsedTenure,
    });

    let savedApplication = null;
    try {
      const application = new Application({
        name: name.trim(),
        pan: pan.trim().toUpperCase(),
        monthlyRevenue: parsedRevenue,
        loanAmount: parsedLoanAmount,
        tenure: parsedTenure,
        decision: decisionResult.decision,
        creditScore: decisionResult.creditScore,
        emi: decisionResult.emi,
        reasonCodes: decisionResult.reasonCodes,
      });

      savedApplication = await application.save();
    } catch (dbErr) {
      console.warn('MongoDB save skipped:', dbErr.message);
    }

    return res.status(201).json({
      success: true,
      applicationId: savedApplication?._id || null,
      result: {
        decision: decisionResult.decision,
        creditScore: decisionResult.creditScore,
        reasons: decisionResult.reasonCodes
      },
    });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { submitApplication };
