const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  city: { type: String, trim: true },
  ranking: Number,
  website: String,
  createdAt: { type: Date, default: Date.now },
});

universitySchema.index({ country: 1 });
universitySchema.index({ country: 1, ranking: 1 });

module.exports = mongoose.model('University', universitySchema);
