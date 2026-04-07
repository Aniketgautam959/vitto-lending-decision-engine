const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const applicationRoutes = require('./routes/application');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// ─── Bonus: Logging & Audit Trail ──────────────────────────────────────────────
// Create a write stream (in append mode) for audit logs
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'audit.log'), { flags: 'a' });
// Log all requests to console and to the audit.log file
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev')); // Console colorized logging

// ─── Bonus: Rate Limiting ──────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Apply rate limiter specifically to the submission endpoint
app.use('/api/application', apiLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/application', applicationRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Vitto Lending API is running' });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Database & Server Startup ────────────────────────────────────────────────
const PORT = process.env.PORT || 5005;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vitto_lending';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Vitto Lending Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    // Still start the server even without DB (for demo purposes)
    app.listen(PORT, () => {
      console.log(`⚠️  Server running on port ${PORT} (without MongoDB)`);
    });
  });

module.exports = app;
