const express = require('express');
const {
  applyToProgram,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getApplicationHistory,
} = require('../controllers/applicationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { applicationValidators, statusUpdateValidators } = require('../utils/validators');

const router = express.Router();

router.post('/', protect, applicationValidators, applyToProgram);
router.get('/', protect, getMyApplications);
router.get('/all', protect, restrictTo('admin', 'counselor'), getAllApplications);
router.get('/:id/history', protect, getApplicationHistory);
router.get('/:id', protect, getApplicationById);
router.patch('/:id/status', protect, statusUpdateValidators, updateApplicationStatus);

module.exports = router;
