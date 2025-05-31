// routes/submitFormContactRoute.js
const express = require('express');
const router = express.Router();
const { pool } = require('../db'); // Import your database pool

router.post('/', async (req, res) => {
  let connection;
  
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate field lengths
    if (name.length > 255 || email.length > 255 || subject.length > 255) {
      return res.status(400).json({ error: 'Field length exceeds maximum allowed' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Sanitize inputs to prevent basic XSS
    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedSubject = subject.trim();
    const sanitizedMessage = message.trim();

    // Get connection from pool
    connection = await pool.getConnection();

    // Insert into database
    const [result] = await connection.execute(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [sanitizedName, sanitizedEmail, sanitizedSubject, sanitizedMessage]
    );

    console.log('Contact form submitted:', {
      id: result.insertId,
      name: sanitizedName,
      email: sanitizedEmail,
      subject: sanitizedSubject,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you within 24-48 hours.',
      id: result.insertId
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    // Check if it's a database error
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ error: 'Database table not found. Please contact system administrator.' });
    } else if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Duplicate entry detected.' });
    } else if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'Database connection failed. Please try again later.' });
    }
    
    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
  } finally {
    // Always release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;