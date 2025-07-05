// db_connect.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the pool connection
pool.getConnection()
  .then((conn) => {
    console.log('✅ DB Pool Connected Successfully');
    conn.release(); // always release after checking
  })
  .catch((err) => {
    console.error('❌ DB Pool Connection Failed:', err.message);
  });

module.exports = pool;
