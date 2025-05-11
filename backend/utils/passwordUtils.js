const bcrypt = require('bcryptjs');

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * Compare password with hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} - True if passwords match
 */
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Password strength validation
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with success flag and message
 */
function validatePasswordStrength(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  
  if (!strongPasswordRegex.test(password)) {
    return {
      success: false,
      message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number'
    };
  }
  
  return { success: true };
}

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength
};