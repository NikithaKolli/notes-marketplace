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

    // Buyer email తో ఉన్న యూజర్‌ని వెతకడం
    let [[user]] = await db.query('SELECT * FROM users WHERE email = ?', [buyer_email]);
    if (user) {
      finalUserId = user.id;
    } else if (!finalUserId) {
      const [newUser] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [buyer_email.split('@')[0], buyer_email, 'no_password_mock', 'student']
      );
      finalUserId = newUser.insertId;
    }

    // Orders table లో ఎంట్రీ
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, note_id) VALUES (?, ?)',
      [finalUserId, note_id]
    );
    const orderId = orderResult.insertId;

    // License key create చేయడం
    const licenseKey = uuidv4();
    await db.query(
      'INSERT INTO license_keys (order_id, uuid) VALUES (?, ?)',
      [orderId, licenseKey]
    );

    const downloadLink = note.file_url || `https://notes-marketplace-api.onrender.com/uploads/${note.filename}`;

    // Non-blocking Email
    try {
      if (typeof sendLicenseEmail === 'function') {
        sendLicenseEmail(buyer_email, note.title, licenseKey, downloadLink).catch(err => {
          console.error('Brevo Email error:', err);
        });
      }
    } catch (mailErr) {}

    await db.query('UPDATE notes SET downloads_count = downloads_count + 1 WHERE id = ?', [note_id]);

    return res.json({ success: true, licenseKey, downloadLink });
  } catch (err) {
    console.error('Purchase route error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. User కొన్న నోట్స్ అన్నీ Fetch చేయడం
router.get('/my/:userId', async (req, res) => {
  try {
    const param = req.params.userId;

    const [rows] = await db.query(
      `SELECT 
         o.id AS order_id, 
         n.title, 
         n.subject, 
         n.price, 
         n.file_url, 
         n.filename,
         lk.uuid AS license_key
       FROM orders o
       JOIN notes n ON o.note_id = n.id
       LEFT JOIN license_keys lk ON lk.order_id = o.id
       LEFT JOIN users u ON o.user_id = u.id
       WHERE u.id = ? OR u.email = ? OR o.user_id = ?
       ORDER BY o.id DESC`,
      [param, param, param]
    );

    res.json(rows);
  } catch (err) {
    console.error('Fetch purchases error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;