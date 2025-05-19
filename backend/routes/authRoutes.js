const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { registerValidation, loginValidation, validate } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// Register route
router.post('/register', registerValidation, validate, register);
// Login route
router.post('/login', loginValidation, validate, login);
// Get current user route
router.get('/me', protect, getMe);

// routes/auth.js
router.get('/verify', protect, (req, res) => {
  res.json({ 
    success: true,
    user: req.user
  })
})
module.exports = router;