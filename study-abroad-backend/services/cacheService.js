const redis = require('../config/redis');

async function getCache(key) {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn('Cache get error', err);
    return null;
  }
}

async function setCache(key, value, ttlSeconds = 300) {
  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (err) {
    console.warn('Cache set error', err);
  }
}

async function deleteCache(key) {
  try {
    await redis.del(key);
  } catch (err) {
    console.warn('Cache del error', err);
  }
}

async function deleteCacheByPattern(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (err) {
    console.warn('Cache pattern del error', err);
  }
}

function buildKey(...parts) {
  return parts.join(':');
}

module.exports = { getCache, setCache, deleteCache, deleteCacheByPattern, buildKey };
