require('dotenv').config();

// Validate JWT secret exists
if (!process.env.JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable');
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '1h',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
};