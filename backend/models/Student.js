const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  instituteId: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Add index for faster lookups
studentSchema.index({ rollNumber: 1, instituteId: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);