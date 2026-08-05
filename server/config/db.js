// Ee file MySQL database ki connect avvadaniki
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Nikki06',   // ఇక్కడ ni MySQL root password పెట్టు
  database: 'notes_marketplace'
});

module.exports = pool;