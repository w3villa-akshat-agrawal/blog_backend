require('dotenv').config();

const baseConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2',
    },
  },
};

module.exports = {
  development: { ...baseConfig },
  production: { ...baseConfig }, // ✅ now production uses same config
};
