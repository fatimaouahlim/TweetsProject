
//routes/forgotpassword.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../db'); // Adjust path to your database connection
const { sendPasswordResetEmail } = require('../services/emailService');

const router = express.Router();

// Request password reset
router.post('/forgot-password', async (req, res) => {
  let connection;
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    connection = await pool.getConnection();

    // Find user by email
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    
    if (users.length === 0) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({ 
        message: 'If an account with this email exists, you will receive a password reset link shortly.' 
      });
    }

    const user = users[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save reset token to user
    await connection.query(
      'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, user.id]
    );

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await sendPasswordResetEmail(user.email, user.username || user.email, resetUrl);

    res.status(200).json({ 
      message: 'If an account with this email exists, you will receive a password reset link shortly.' 
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  let connection;
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    connection = await pool.getConnection();

    // Find user with valid reset token
    const [users] = await connection.query(
      'SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?',
      [token, new Date()]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const user = users[0];

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password and clear reset token
    await connection.query(
      'UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: 'Password has been reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

// Verify reset token (optional - for frontend validation)
router.get('/verify-reset-token/:token', async (req, res) => {
  let connection;
  try {
    const { token } = req.params;

    connection = await pool.getConnection();

    const [users] = await connection.query(
      'SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?',
      [token, new Date()]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const user = users[0];
    res.status(200).json({ message: 'Token is valid', email: user.email });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;