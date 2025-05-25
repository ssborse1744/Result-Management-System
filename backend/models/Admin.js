const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const AdminSchema = new mongoose.Schema({
  instituteId: {
    type: String,
    required: [true, 'Institute ID is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Institute ID must be at least 3 characters'],
    maxlength: [20, 'Institute ID cannot exceed 20 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Never return password in queries
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
}, {
  versionKey: false // Disable the __v field
});

// Password hashing middleware
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password verification method
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Complete AdminSchema
AdminSchema.statics.validateInput = function(data) {
  const errors = [];

  if (!data.instituteId || !data.password) {
    errors.push('All fields are required');
  }

  if (data.instituteId && (data.instituteId.length < 3 || data.instituteId.length > 20)) {
    errors.push('Institute ID must be between 3 and 20 characters');
  }

  if (data.password && data.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  return errors;
};

module.exports = mongoose.model('Admin', AdminSchema);