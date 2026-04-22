const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  status: {
    type: String,
    enum: ['Applied', 'Reviewed', 'Accepted', 'Rejected', 'Withdrawn'],
    default: 'Applied',
  },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Non-unique index: allows re-application after withdrawal (enforced at app level)
applicationSchema.index({ user: 1, program: 1 });
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1 });

module.exports = mongoose.model('Application', applicationSchema);
