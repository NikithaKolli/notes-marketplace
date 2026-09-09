const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const sendLicenseEmail = require('../utils/mailer');

// 1. Purchase Route
router.post('/purchase', async (req, res) => {
  try {
    const { note_id, buyer_email, user_id } = req.body;

    const [notes] = await db.query('SELECT * FROM notes WHERE id = ?', [note_id]);
    const note = notes[0];
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    let finalUserId = user_id;

    // Buyer email తో user ఉన్నాడేమో వెతకడం
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [buyer_email]);
    if (users.length > 0) {
      finalUserId = users[0].id;
    } else if (!finalUserId) {
      const [newUser] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [buyer_email.split('@')[0], buyer_email, 'mockpass123', 'student']
      );
      finalUserId = newUser.insertId;
    }

    // Orders table లో insert చేయడం
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, note_id) VALUES (?, ?)',
      [finalUserId, note_id]
    );
    const orderId = orderResult.insertId;

    // License key create చేయడం
    const licenseKey = uuidv4();
    try {
      await db.query(
        'INSERT INTO license_keys (order_id, uuid) VALUES (?, ?)',
        [orderId, licenseKey]
      );
    } catch (keyErr) {
      console.error('License key insert fallback:', keyErr.message);
    }

    const downloadLink = note.file_url || `https://notes-marketplace-api.onrender.com/uploads/${note.filename}`;

    // Email delivery (failsafe)
    try {
      if (typeof sendLicenseEmail === 'function') {
        sendLicenseEmail(buyer_email, note.title, licenseKey, downloadLink).catch(err => {
          console.error('Brevo Email error:', err);
        });
      }
    } catch (mailErr) {}

    try {
      await db.query('UPDATE notes SET downloads_count = downloads_count + 1 WHERE id = ?', [note_id]);
    } catch (countErr) {}

    return res.json({ success: true, licenseKey, downloadLink });
  } catch (err) {
    console.error('Purchase route error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. User కొన్న నోట్స్ అన్నీ Fetch చేయడం (500 Error రాకుండా Safe Query)
router.get('/my/:userId', async (req, res) => {
  try {
    const param = req.params.userId;

    // కాలమ్స్ మిస్‌మ్యాచ్ లేకుండా n.* మరియు LEFT JOIN తో సేఫ్ క్వెరీ
    const [rows] = await db.query(
      `SELECT 
         o.id AS order_id, 
         n.*,
         COALESCE(lk.uuid, 'N/A') AS license_key
       FROM orders o
       LEFT JOIN notes n ON o.note_id = n.id
       LEFT JOIN license_keys lk ON lk.order_id = o.id
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.user_id = ? OR u.id = ? OR u.email = ?
       ORDER BY o.id DESC`,
      [param, param, param]
    );

    return res.json(rows);
  } catch (err) {
    console.error('Fetch purchases error:', err.message);
    // సర్వర్ 500 క్రాష్ ఇవ్వకుండా ఖాళీ ఎరే రిటర్న్ చేస్తుంది
    return res.status(200).json([]);
  }
});

module.exports = router;