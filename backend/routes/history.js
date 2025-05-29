// routes/history.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');




// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Create database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Save search to history
router.post('/save', authenticateToken, async (req, res) => {
  try {
    const { query, search_type, tweets_data, summary, sentiment_analysis } = req.body;
    const user_id = req.user.id;

    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      `INSERT INTO search_history (user_id, query, search_type, tweets_data, summary, sentiment_analysis) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, query, search_type, JSON.stringify(tweets_data), summary, JSON.stringify(sentiment_analysis)]
    );

    await connection.end();

    res.status(201).json({
      success: true,
      message: 'Search saved to history',
      historyId: result.insertId
    });
  } catch (error) {
    console.error('Error saving to history:', error);
    res.status(500).json({ message: 'Failed to save search to history' });
  }
});

// Get user's search history
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const connection = await mysql.createConnection(dbConfig);
    
    // Get total count
    const [countResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM search_history WHERE user_id = ?',
      [user_id]
    );
    
    // Get paginated history
    const [history] = await connection.execute(
      `SELECT id, query, search_type, tweets_data, summary, sentiment_analysis, created_at 
       FROM search_history 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [user_id, limit, offset]
    );

    await connection.end();

    // Parse JSON fields
    const processedHistory = history.map(item => ({
      ...item,
      tweets_data: JSON.parse(item.tweets_data),
      sentiment_analysis: JSON.parse(item.sentiment_analysis)
    }));

    res.json({
      success: true,
      data: processedHistory,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(countResult[0].total / limit),
        total_items: countResult[0].total,
        items_per_page: limit
      }
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Failed to fetch search history' });
  }
});

// Get specific history item
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const history_id = req.params.id;

    const connection = await mysql.createConnection(dbConfig);
    
    const [history] = await connection.execute(
      `SELECT id, query, search_type, tweets_data, summary, sentiment_analysis, created_at 
       FROM search_history 
       WHERE id = ? AND user_id = ?`,
      [history_id, user_id]
    );

    await connection.end();

    if (history.length === 0) {
      return res.status(404).json({ message: 'History item not found' });
    }

    const item = history[0];
    const processedItem = {
      ...item,
      tweets_data: JSON.parse(item.tweets_data),
      sentiment_analysis: JSON.parse(item.sentiment_analysis)
    };

    res.json({
      success: true,
      data: processedItem
    });
  } catch (error) {
    console.error('Error fetching history item:', error);
    res.status(500).json({ message: 'Failed to fetch history item' });
  }
});

// Delete history item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const history_id = req.params.id;

    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      'DELETE FROM search_history WHERE id = ? AND user_id = ?',
      [history_id, user_id]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'History item not found' });
    }

    res.json({
      success: true,
      message: 'History item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting history item:', error);
    res.status(500).json({ message: 'Failed to delete history item' });
  }
});


module.exports = router;