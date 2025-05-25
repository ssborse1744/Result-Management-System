const Subject = require('../models/Subject');

exports.createSubject = async (req, res) => {
  try {
    const { name } = req.body;
    const instituteId = req.user.instituteId;

    // Check if subject already exists for this institute
    const existingSubject = await Subject.findOne({ name: name.toLowerCase(), instituteId });
    if (existingSubject) {
      return res.status(400).json({ error: 'Subject already exists' });
    }

    const subject = new Subject({
      name: name.toLowerCase(),
      instituteId
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    const subjects = await Subject.find({ instituteId });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const instituteId = req.user.instituteId;

    // Check if subject exists and belongs to this institute
    const subject = await Subject.findOne({ _id: id, instituteId });
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    await Subject.deleteOne({ _id: id });
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
