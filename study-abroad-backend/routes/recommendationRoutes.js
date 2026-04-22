const express = require('express');
const { getRecommendations } = require('../controllers/recommendationController');
const { optionalAuth } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');
const { preferencesValidators } = require('../utils/validators');

const router = express.Router();

router.post('/', apiLimiter, optionalAuth, preferencesValidators, getRecommendations);

module.exports = router;
