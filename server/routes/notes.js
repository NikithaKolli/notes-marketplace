// Ee file - notes upload cheyadam mariyu list cheyadam kosam routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');

// Multer ki file ఎక్కడ save cheyalo, e peru tho save cheyalo cheputhunnam
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));   // uploads folder lo save avutundi
  },
  filename: (req, file, cb) => {
    // file peru unique ga undadaniki, current time + original name కలుపుతున్నాం
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ==========================================
// ROUTE 1: Seller PDF upload chesetappudu ee route call avutundi
// ==========================================
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, subject, semester, description, price, seller_id } = req.body;
    const filename = req.file.filename;   // multer ichina saved file peru

    const [result] = await db.query(
      `INSERT INTO notes (seller_id, title, subject, semester, description, price, filename)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [seller_id, title, subject, semester, description, price, filename]
    );

    res.json({ success: true, message: 'Note uploaded successfully!', noteId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// ROUTE 2: Anni notes list chudadaniki (catalog page kosam)
// ==========================================
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM notes ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// ROUTE 3: Oka specific note details chudadaniki
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM notes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// ROUTE 4: Oka seller upload chesina notes anni (Dashboard kosam)
// ==========================================
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM notes WHERE seller_id = ? ORDER BY created_at DESC',
      [req.params.sellerId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;