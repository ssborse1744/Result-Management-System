// controllers/authController.js
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { instituteId, password } = req.body;

    // Validate input
    const errors = Admin.validateInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ instituteId });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Institute ID already registered' });
    }

    // Create new admin
    const admin = await Admin.create({
      instituteId,
      password
    });    // Generate token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      token,
      instituteId: admin.instituteId
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { instituteId, password } = req.body;

    // Validate input
    if (!instituteId || !password) {
      return res.status(400).json({ error: 'Please provide both institute ID and password' });
    }

    // Find admin and include password field for comparison
    const admin = await Admin.findOne({ instituteId }).select('+password');
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      instituteId: admin.instituteId
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};