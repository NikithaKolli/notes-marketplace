// Ee file - Mock purchase, UUID key generate cheyadam, email pampadam
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const sendLicenseEmail = require('../utils/mailer');

router.post('/purchase', async (req, res) => {
  try {
    const { note_id, buyer_email } = req.body;

    // 1. Note details tesukuntam
    const [[note]] = await db.query('SELECT * FROM notes WHERE id = ?', [note_id]);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    // 2. Buyer ni users table lo check cheyadam
    let [[user]] = await db.query('SELECT * FROM users WHERE email = ?', [buyer_email]);
    if (!user) {
      const [userResult] = await db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [buyer_email.split('@')[0], buyer_email, 'no_password_mock', 'student']
      );
      user = { id: userResult.insertId };
    }

    // 3. Orders table lo save cheyadam
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, note_id) VALUES (?, ?)',
      [user.id, note_id]
    );
    const orderId = orderResult.insertId;

    // 4. UUID license key generate cheyadam
    const licenseKey = uuidv4();
    await db.query(
      'INSERT INTO license_keys (order_id, uuid) VALUES (?, ?)',
      [orderId, licenseKey]
    );

    // 5. Download link create cheyadam
    const downloadLink = `https://notes-marketplace-api.onrender.com/uploads/${note.filename}`;

    // 6. Email background lo pampadam (request aagakunda untundi)
    try {
      if (typeof sendLicenseEmail === 'function') {
        sendLicenseEmail(buyer_email, note.title, licenseKey, downloadLink).catch(err => {
          console.error('Email sending failed (non-blocking):', err.message);
        });
      }
    } catch (mailErr) {
      console.error('Mail trigger error:', mailErr.message);
    }

    // 7. downloads_count +1
    await db.query('UPDATE notes SET downloads_count = downloads_count + 1 WHERE id = ?', [note_id]);

    // Fast ga response pampadam
    return res.json({ success: true, licenseKey, downloadLink });
  } catch (err) {
    console.error('Purchase route error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// ROUTE: Oka user konna notes anni (My Purchases page kosam)
// ==========================================
router.get('/my/:userId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT o.id AS order_id, n.title, n.subject, n.price, n.filename,
              lk.uuid AS license_key, o.purchase_date
       FROM orders o
       JOIN notes n ON o.note_id = n.id
       JOIN license_keys lk ON lk.order_id = o.id
       WHERE o.user_id = ?
       ORDER BY o.purchase_date DESC`,
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;