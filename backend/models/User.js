const { pool } = require('../db');
const bcrypt = require('bcryptjs');

class User {
  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create new user
  static async create(userData) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Insert user into database
      const [result] = await pool.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [userData.username, userData.email, hashedPassword]
      );

      return {
        id: result.insertId,
        username: userData.username,
        email: userData.email
      };
    } catch (error) {
      throw error;
    }
  }

  // Check if email already exists
  static async emailExists(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM users WHERE email = ?',
        [email]
      );
      return rows[0].count > 0;
    } catch (error) {
      throw error;
    }
  }

  // Check if username already exists
  static async usernameExists(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT COUNT(*) as count FROM users WHERE username = ?',
        [username]
      );
      return rows[0].count > 0;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;