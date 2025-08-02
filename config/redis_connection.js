const { createClient } = require('redis');

const redis = createClient({
  username: 'default',
  password: 'gcqMMmPYJJrv3WEbc5fFCNJGnrXpz2Av',
  socket: {
    host: 'redis-11748.c281.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 11748,
  },
});

redis.on('error', (err) => console.error('Redis Client Error', err));

// Immediately connect once
redis.connect()
  .then(() => console.log('✅ Redis connected'))
  .catch((err) => console.error('❌ Redis connection error:', err));

module.exports = redis;
