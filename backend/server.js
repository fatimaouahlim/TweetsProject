const app = require('./app');
const { port, nodeEnv } = require('./config');
const { testConnection } = require('./db');

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