const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL, { lazyConnect: true });

redisClient.on('error', (err) => {
  console.warn('Redis error', err.message);
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

function isRedisReady() {
  return redisClient.status === 'ready';
}

module.exports = redisClient;
module.exports.isRedisReady = isRedisReady;
