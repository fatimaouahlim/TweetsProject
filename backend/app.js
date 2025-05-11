const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { corsOrigin } = require('./config');
const authRoutes = require('./routes/authRoutes');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Twanalyze API is running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;