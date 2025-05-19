// Load environment variables FIRST before requiring anything else
require('dotenv').config();

// Now require your app and other modules
const app = require('./app');
const { port, nodeEnv } = require('./config');
const { testConnection } = require('./db');

console.log('Environment variables loaded:', {
  JWT_SECRET: process.env.JWT_SECRET ? '*****' : 'NOT SET',
  NODE_ENV: process.env.NODE_ENV
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('Failed to connect to database. Exiting application...');
      process.exit(1);
    }
    
    app.listen(port, () => {
      console.log(`Server running in ${nodeEnv} mode on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();