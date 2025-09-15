const { createClient } = require('redis');
require('dotenv').config();

const redis = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redis.on('error', (err) => console.error('Redis Client Error', err));

// Immediately connect once
redis.connect()
  .then(() => console.log('✅ Redis connected'))
  .catch((err) => console.error('❌ Redis connection error:', err));

module.exports = redis;
