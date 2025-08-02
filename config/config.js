require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000, // TiDB Cloud default port
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true, // set to false only during testing
        minVersion: 'TLSv1.2'
      }
    }
  }
};
