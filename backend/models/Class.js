const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instituteId: { type: String, required: true },
  subjects: [{ name: String }]
});

module.exports = mongoose.model('Class', classSchema);
