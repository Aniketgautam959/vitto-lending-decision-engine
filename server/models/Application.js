/**
 * Application.js — Mongoose Schema for Loan Applications
 */

const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    pan: {
      type: String,
      required: [true, 'PAN is required'],
      uppercase: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'],
    },
    monthlyRevenue: {
      type: Number,
      required: [true, 'Monthly revenue is required'],
      min: [1, 'Monthly revenue must be positive'],
    },
    loanAmount: {
      type: Number,
      required: [true, 'Loan amount is required'],
      min: [1, 'Loan amount must be positive'],
    },
    tenure: {
      type: Number,
      required: [true, 'Tenure is required'],
      min: [1, 'Tenure must be at least 1 month'],
    },
    decision: {
      type: String,
      enum: ['Approved', 'Rejected'],
    },
    creditScore: {
      type: Number,
    },
    emi: {
      type: Number,
    },
    reasonCodes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);
