const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser'); // Add this import
const { corsOrigin } = require('./config');
const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/history');  
const contactRoutes = require('./routes/submitContactFormRoute'); // Fixed import
const adminContactMessagesRoute = require('./routes/adminContactMessagesRoute');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration 
app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  credentials: true // for cookies
}));

// Cookie parser middleware - Add this BEFORE your routes
app.use(cookieParser());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin/messages', adminContactMessagesRoute); 

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