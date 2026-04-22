const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'counselor', 'admin'], default: 'user' },
  preferences: {
    country: { type: String, default: '' },
    budget: { type: Number, default: 0 },
    fieldOfStudy: { type: String, default: '' },
    intakeMonth: { type: String, default: '' },
    ieltsScore: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.comparePassword = async function comparePassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.passwordHash;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
