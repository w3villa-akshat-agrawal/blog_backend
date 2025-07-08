// redisClient.js
const Redis = require('ioredis');

// Default host = 127.0.0.1 and port = 6379
const redis = new Redis(); // or pass options: new Redis({ host: 'localhost', port: 6379 })

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

module.exports = redis;
