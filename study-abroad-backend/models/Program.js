const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  name: { type: String, required: true, trim: true },
  fieldOfStudy: { type: String, required: true, trim: true },
  degree: { type: String, enum: ['Bachelors', 'Masters', 'PhD', 'Diploma'], required: true },
  duration: Number,
  tuition: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  intakeMonths: [String],
  ieltsMin: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

programSchema.index({ university: 1 });
programSchema.index({ fieldOfStudy: 1 });
programSchema.index({ fieldOfStudy: 1, tuition: 1 });
programSchema.index({ ieltsMin: 1 });
programSchema.index({ tuition: 1 });

module.exports = mongoose.model('Program', programSchema);
