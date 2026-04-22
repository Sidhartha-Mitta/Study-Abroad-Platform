const mongoose = require('mongoose');

const applicationHistorySchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  fromStatus: { type: String, default: null },
  toStatus: { type: String, required: true },
  note: { type: String, default: '' },
  changedAt: { type: Date, default: Date.now },
});

applicationHistorySchema.index({ application: 1 });

module.exports = mongoose.model('ApplicationHistory', applicationHistorySchema);
