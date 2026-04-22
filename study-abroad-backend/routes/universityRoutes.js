const express = require('express');
const { getUniversities, getUniversityById, getPrograms, createUniversity, createProgram } = require('../controllers/universityController');
const { apiLimiter } = require('../middleware/rateLimiter');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', apiLimiter, getUniversities);
router.post('/', protect, restrictTo('admin'), createUniversity);
router.post('/:id/programs', protect, restrictTo('admin'), createProgram);
router.get('/programs/all', apiLimiter, getPrograms);
router.get('/:id', apiLimiter, getUniversityById);

module.exports = router;
