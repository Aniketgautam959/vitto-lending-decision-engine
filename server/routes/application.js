/**
 * application.js — Route definitions for loan application API
 */

const express = require('express');
const router = express.Router();
const { submitApplication } = require('../controllers/applicationController');

// POST /api/application — Submit a new loan application
router.post('/', submitApplication);

module.exports = router;
