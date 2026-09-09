// Ee file backend server ni start chestundi
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

// CORS Issue fix cheyadaniki
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/notes', require('./routes/notes'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/auth', require('./routes/auth'));
app.use('/uploads', express.static('uploads'));

// Test route - server pani chestunda ledo check cheyadaniki
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Database connection test route
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json({ success: true, users: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Render dynamic PORT ni pick cheskovadaniki
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});