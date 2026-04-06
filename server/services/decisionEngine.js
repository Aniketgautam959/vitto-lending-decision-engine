/**
 * decisionEngine.js — Core Credit Decision Service
 */

/**
 * evaluateApplication
 *
 * @param {Object} applicationData
 * @param {number} applicationData.monthlyRevenue - Monthly revenue in INR
 * @param {number} applicationData.loanAmount     - Requested loan amount in INR
 * @param {number} applicationData.tenure         - Repayment tenure in months (must be > 0)
 * @returns {{ decision: string, creditScore: number, reasonCodes: string[], emi: number }}
 */
function evaluateApplication({ monthlyRevenue, loanAmount, tenure }) {
  if (!tenure || tenure <= 0) {
    throw new Error('Tenure must be a positive number to calculate EMI.');
  }

  const emi = Math.round(loanAmount / tenure);
  
  let decision = 'Approved';
  let score = 100;
  const reasonCodes = [];

  if (monthlyRevenue < 20000) {
    decision = 'Rejected';
    score -= 50;
    reasonCodes.push('Monthly revenue is below ₹20,000 threshold.');
  }

  if (emi > 0.4 * monthlyRevenue) {
    decision = 'Rejected';
    score -= 50;
    reasonCodes.push('EMI exceeds 40% of monthly revenue.');
  }

  if (decision === 'Approved') {
    reasonCodes.push('All financial parameters are accepted.');
  }

  return {
    decision,
    creditScore: Math.max(0, score),
    reasonCodes,
    emi,
  };
}

module.exports = { evaluateApplication };
