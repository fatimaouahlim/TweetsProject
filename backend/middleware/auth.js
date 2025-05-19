//middleware/auth.js
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const User = require('../models/User');

console.log('Current JWT Config:', {
  secret: process.env.JWT_SECRET,
  expire: process.env.JWT_EXPIRE
});
/**
 * Middleware to protect routes that require authentication
 */
async function protect(req, res, next) {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // Get user from the token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
}

module.exports = {
  protect
};