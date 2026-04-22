const express = require('express');
const { register, login, getProfile, updatePreferences } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerValidators, loginValidators, preferencesValidators } = require('../utils/validators');

const router = express.Router();

router.post('/register', authLimiter, registerValidators, register);
router.post('/login', authLimiter, loginValidators, login);
router.get('/profile', protect, getProfile);
router.patch('/preferences', protect, preferencesValidators, updatePreferences);

module.exports = router;
