const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const redisClient = require('./config/redis');
const mountRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
app.set('trust proxy', 1);

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

mountRoutes(app);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

async function start() {
  const PORT = process.env.PORT || 5000;
  await connectDB();
  try {
    await redisClient.connect();
  } catch (err) {
    console.warn('Redis unavailable, continuing without cache');
  }
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);
  await mongoose.connection.close();
  try {
    await redisClient.quit();
  } catch (err) {
    console.warn('Redis shutdown error', err.message);
  }
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

if (require.main === module) {
  start();
}

module.exports = app;
