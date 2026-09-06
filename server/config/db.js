// Ee file MySQL database ki connect avvadaniki
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'YOUR_MYSQL_PASSWORD',
  database: process.env.DB_NAME || 'test',
  port: Number(process.env.DB_PORT) || 3306,
  ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  } : false
});

module.exports = pool;