const Application = require('../models/Application');
const ApplicationHistory = require('../models/ApplicationHistory');
const Program = require('../models/Program');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { getCache, setCache, deleteCache } = require('../services/cacheService');

const VALID_TRANSITIONS = {
  Applied: ['Reviewed', 'Withdrawn'],
  Reviewed: ['Accepted', 'Rejected', 'Withdrawn'],
  Accepted: [],
  Rejected: [],
  Withdrawn: [],
};

async function applyToProgram(req, res, next) {
  try {
    const { programId } = req.body;
    const program = await Program.findById(programId).populate('university');
    if (!program) return errorResponse(res, 404, 'Program not found');

    const existing = await Application.findOne({ user: req.user._id, program: programId, status: { $ne: 'Withdrawn' } }).lean();
    if (existing) return errorResponse(res, 409, 'You have already applied to this program');

    const application = await Application.create({
      user: req.user._id,
      program: programId,
      university: program.university._id,
      status: 'Applied',
    });

    await ApplicationHistory.create({
      application: application._id,
      fromStatus: null,
      toStatus: 'Applied',
      note: 'Application submitted',
    });

    await deleteCache(`userApplications:${req.user._id}`);

    const populated = await Application.findById(application._id)
      .populate('program', 'name fieldOfStudy tuition degree')
      .populate('university', 'name country city ranking')
      .lean();

    return successResponse(res, 201, 'Application submitted', populated);
  } catch (err) {
    return next(err);
  }
}

async function getMyApplications(req, res, next) {
  try {
    const cacheKey = `userApplications:${req.user._id}`;
    const cached = await getCache(cacheKey);
    if (cached) return successResponse(res, 200, 'Applications retrieved', cached);

    const applications = await Application.find({ user: req.user._id })
      .populate('program', 'name fieldOfStudy tuition degree duration')
      .populate('university', 'name country city ranking')
      .sort({ appliedAt: -1 })
      .lean();

    await setCache(cacheKey, applications, 120);
    return successResponse(res, 200, 'Applications retrieved', applications);
  } catch (err) {
    return next(err);
  }
}

async function getAllApplications(req, res, next) {
  try {
    const applications = await Application.find({})
      .populate('user', 'name email')
      .populate('program', 'name fieldOfStudy tuition degree duration')
      .populate('university', 'name country city ranking')
      .sort({ appliedAt: -1 })
      .lean();

    return successResponse(res, 200, 'All applications retrieved', applications);
  } catch (err) {
    return next(err);
  }
}

async function getApplicationById(req, res, next) {
  try {
    const application = await Application.findById(req.params.id).populate('program').populate('university').lean();
    if (!application) return errorResponse(res, 404, 'Application not found');
    
    const isOwner = application.user.toString() === req.user._id.toString();
    const isStaff = ['admin', 'counselor'].includes(req.user.role);
    
    if (!isOwner && !isStaff) {
      return errorResponse(res, 403, 'Not authorized to view this application');
    }
    return successResponse(res, 200, 'Application retrieved', application);
  } catch (err) {
    return next(err);
  }
}

async function updateApplicationStatus(req, res, next) {
  try {
    const { status: newStatus, note = '' } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return errorResponse(res, 404, 'Application not found');
    
    const isOwner = application.user.toString() === req.user._id.toString();
    const isStaff = ['admin', 'counselor'].includes(req.user.role);
    
    if (!isOwner && !isStaff) {
      return errorResponse(res, 403, 'Not authorized');
    }

    if (!isStaff && newStatus !== 'Withdrawn') {
      return errorResponse(res, 403, 'Students can only withdraw their applications');
    }

    const allowed = VALID_TRANSITIONS[application.status] || [];
    if (!allowed.includes(newStatus)) {
      return errorResponse(
        res,
        400,
        `Invalid transition: ${application.status} -> ${newStatus}. Allowed: ${allowed.join(', ') || 'none'}`
      );
    }

    const fromStatus = application.status;
    application.status = newStatus;
    application.updatedAt = new Date();
    await application.save();

    await ApplicationHistory.create({ application: application._id, fromStatus, toStatus: newStatus, note });
    // Clear cache for both the updater and the application owner
    await deleteCache(`userApplications:${req.user._id}`);
    await deleteCache(`userApplications:${application.user.toString()}`);
    await deleteCache(`application:${application._id}`);

    return successResponse(res, 200, 'Status updated', application);
  } catch (err) {
    return next(err);
  }
}

async function getApplicationHistory(req, res, next) {
  try {
    const application = await Application.findById(req.params.id).lean();
    if (!application) return errorResponse(res, 404, 'Application not found');
    
    const isOwner = application.user.toString() === req.user._id.toString();
    const isStaff = ['admin', 'counselor'].includes(req.user.role);
    
    if (!isOwner && !isStaff) {
      return errorResponse(res, 403, 'Not authorized');
    }

    const history = await ApplicationHistory.find({ application: req.params.id }).sort({ changedAt: 1 }).lean();
    return successResponse(res, 200, 'History retrieved', history);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  VALID_TRANSITIONS,
  applyToProgram,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getApplicationHistory,
};
