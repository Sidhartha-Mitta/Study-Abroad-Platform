const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

async function register(req, res, next) {
  try {
    const { name, email, password, adminSecret, counselorSecret } = req.body;
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return errorResponse(res, 409, 'Email already registered');
    }

    let role = 'user';
    if (adminSecret && adminSecret === process.env.ADMIN_SECRET) role = 'admin';
    else if (counselorSecret && counselorSecret === process.env.COUNSELOR_SECRET) role = 'counselor';

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role });
    const token = signToken(user._id);

    return successResponse(res, 201, 'Registration successful', {
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, preferences: user.preferences },
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const token = signToken(user._id);
    return successResponse(res, 200, 'Login successful', {
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, preferences: user.preferences },
    });
  } catch (err) {
    return next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id).lean();
    return successResponse(res, 200, 'Profile retrieved', user);
  } catch (err) {
    return next(err);
  }
}

async function updatePreferences(req, res, next) {
  try {
    const allowed = ['country', 'budget', 'fieldOfStudy', 'intakeMonth', 'ieltsScore'];
    const update = {};

    allowed.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        update[`preferences.${field}`] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { returnDocument: 'after', runValidators: true }
    ).lean();

    return successResponse(res, 200, 'Preferences updated', user);
  } catch (err) {
    return next(err);
  }
}

module.exports = { signToken, register, login, getProfile, updatePreferences };
