const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET all messages with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  let connection;
  try {
    const { status, search, sortBy = 'newest', page = 1, limit = 50 } = req.query;

    connection = await pool.getConnection();

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    let queryParams = [];

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      queryParams.push(status);
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Build ORDER BY
    let orderClause;
    switch (sortBy) {
      case 'oldest': orderClause = 'ORDER BY created_at ASC'; break;
      case 'name': orderClause = 'ORDER BY name ASC'; break;
      default: orderClause = 'ORDER BY created_at DESC'; break;
    }

    // Pagination
    const offset = (page - 1) * limit;

    // Get total count
    const [totalCountResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM contact_messages ${whereClause}`,
      queryParams
    );
    const totalMessages = totalCountResult[0].total;

    // Get messages
    const [messages] = await connection.execute(
      `SELECT id, name, email, subject, message, status, created_at, updated_at 
       FROM contact_messages 
       ${whereClause} 
       ${orderClause} 
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    // Get stats
    const [statsResult] = await connection.execute(
      `SELECT status, COUNT(*) as count FROM contact_messages GROUP BY status`
    );

    const stats = {
      total: totalMessages,
      new: 0,
      read: 0,
      replied: 0,
      archived: 0
    };

    statsResult.forEach(stat => {
      stats[stat.status] = stat.count;
    });

    res.status(200).json({
      success: true,
      data: {
        messages,
        stats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalMessages / limit),
          totalMessages,
          hasNextPage: offset + limit < totalMessages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  } finally {
    if (connection) connection.release();
  }
});

// GET single message
router.get('/:id', async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid message ID' });
    }

    connection = await pool.getConnection();
    const [messages] = await connection.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (messages.length === 0) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.status(200).json({ success: true, data: messages[0] });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch message' });
  } finally {
    if (connection) connection.release();
  }
});

// PATCH update status
router.patch('/:id/status', async (req, res) => {
   console.log('=== PATCH STATUS ROUTE HIT ===');
  console.log('Params:', req.params);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  let connection;
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['new', 'read', 'replied', 'archived'];

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid message ID' });
    }
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    connection = await pool.getConnection();
    const [result] = await connection.execute(
      'UPDATE contact_messages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    const [updatedMessages] = await connection.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Status updated',
      data: updatedMessages[0]
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, error: 'Failed to update status' });
  } finally {
    if (connection) connection.release();
  }
});

// DELETE message
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid message ID' });
    }

    connection = await pool.getConnection();
    const [result] = await connection.execute(
      'DELETE FROM contact_messages WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, error: 'Failed to delete message' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;