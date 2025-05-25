const Class = require('../models/Class');

// Create a new class
exports.createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a class by ID
exports.getClassById = async (req, res) => {
  try {
    const foundClass = await Class.findById(req.params.id);
    if (!foundClass) return res.status(404).json({ error: 'Class not found' });
    res.json(foundClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a class
exports.updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClass) return res.status(404).json({ error: 'Class not found' });
    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a class
exports.deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) return res.status(404).json({ error: 'Class not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
