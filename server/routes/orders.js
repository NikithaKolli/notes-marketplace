const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const sendLicenseEmail = require('../utils/mailer');

// 1. Purchase Route
router.post('/purchase', async (req, res) => {
  try {
    const { note_id, buyer_email, user_id } = req.body;

    const [[note]] = await db.query('SELECT * FROM notes WHERE id = ?', [note_id]);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    let finalUserId = user_id;

    // User ID lekapothe email base chesukuni correct user ni vetakadam / create cheyadam
    let [[existingUser]] = await db.query('SELECT * FROM users WHERE email = ?', [buyer_email]);
    if (existingUser) {
      finalUserId = existingUser.id;
    } else if (!finalUserId) {
      const [newUser] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [buyer_email.split('@')[0], buyer_email, 'no_password_mock', 'student']
      );
      finalUserId = newUser.insertId;
    }

    // Orders table lo save cheyadam
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, note_id) VALUES (?, ?)',
      [finalUserId, note_id]
    );
    const orderId = orderResult.insertId;

    // License key create cheyadam
    const licenseKey = uuidv4();
    await db.query(
      'INSERT INTO license_keys (order_id, uuid) VALUES (?, ?)',
      [orderId, licenseKey]
    );

    const downloadLink = note.file_url || `https://notes-marketplace-api.onrender.com/uploads/${note.filename}`;

    // Resend Email Triggering
    if (typeof sendLicenseEmail === 'function') {
      sendLicenseEmail(buyer_email, note.title, licenseKey, downloadLink).catch(err => {
        console.error('Mail trigger error:', err);
      });
    }

    await db.query('UPDATE notes SET downloads_count = downloads_count + 1 WHERE id = ?', [note_id]);

    return res.json({ success: true, licenseKey, downloadLink });
  } catch (err) {
    console.error('Purchase route error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. User konna notes fetch cheyadam (User ID leda Email tho)
router.get('/my/:userId', async (req, res) => {
  try {
    const userIdOrEmail = req.params.userId;

    const [rows] = await db.query(
      `SELECT o.id AS order_id, n.title, n.subject, n.price, n.file_url, n.filename,
              lk.uuid AS license_key, o.purchase_date
       FROM orders o
       JOIN notes n ON o.note_id = n.id
       JOIN license_keys lk ON lk.order_id = o.id
       JOIN users u ON o.user_id = u.id
       WHERE u.id = ? OR u.email = ?
       ORDER BY o.purchase_date DESC`,
      [userIdOrEmail, userIdOrEmail]
    );
    res.json(rows);
  } catch (err) {
    console.error('My purchases error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;