const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  instituteId: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Add index for faster lookups
subjectSchema.index({ name: 1, instituteId: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
