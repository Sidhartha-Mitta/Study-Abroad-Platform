process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_that_is_long_enough_for_jwt';
process.env.JWT_EXPIRES_IN = '7d';
process.env.REDIS_URL = 'redis://localhost:6379';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

jest.mock('../config/redis.js', () => ({
  get: jest.fn(() => null),
  setex: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(() => []),
  status: 'ready',
  quit: jest.fn(),
  connect: jest.fn(),
  on: jest.fn(),
  isRedisReady: () => false,
}));

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
