const Result = require('../models/Result');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

// Helper function to calculate grade
const calculateGrade = (marks) => {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  if (marks >= 40) return 'D';
  return 'F';
};

exports.createResult = async (req, res) => {
  try {
    const { student: studentId, subjects, examDate, totalMarks, percentage } = req.body;
    const instituteId = req.user.instituteId;

    // Verify student exists and belongs to this institute
    const student = await Student.findOne({ _id: studentId, instituteId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if result already exists for this student
    const existingResult = await Result.findOne({ student: studentId });
    if (existingResult) {
      return res.status(400).json({ error: 'Result already exists for this student' });
    }

    // Verify all subjects exist and belong to this institute
    const subjectIds = subjects.map(s => s.subject);
    const validSubjects = await Subject.find({
      _id: { $in: subjectIds },
      instituteId
    });

    if (validSubjects.length !== subjectIds.length) {
      return res.status(400).json({ error: 'Invalid subject(s)' });
    }

    // Validate marks and calculate grades
    const validatedSubjects = subjects.map(subject => {
      const marks = parseInt(subject.marks);
      if (isNaN(marks) || marks < 0 || marks > 100) {
        throw new Error('Marks must be between 0 and 100');
      }
      return {
        ...subject,
        marks,
        grade: calculateGrade(marks)
      };
    });

    const result = new Result({
      student: studentId,
      subjects: validatedSubjects,
      examDate: new Date(examDate),
      totalMarks,
      percentage,
      instituteId
    });

    await result.save();

    // Populate student and subject details for response
    const populatedResult = await Result.findById(result._id)
      .populate('student')
      .populate('subjects.subject');

    res.status(201).json(populatedResult);
  } catch (error) {
    console.error('Result creation error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

exports.getResults = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    const results = await Result.find({ instituteId })
      .populate('student')
      .populate('subjects.subject');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getResultByStudent = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const instituteId = req.user.instituteId;

    const student = await Student.findOne({ rollNumber, instituteId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const result = await Result.findOne({ student: student._id })
      .populate('student')
      .populate('subjects.subject');

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    const { id } = req.params;
    const instituteId = req.user.instituteId;

    const result = await Result.findOne({ _id: id, instituteId });
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    await Result.deleteOne({ _id: id });
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.checkResult = async (req, res) => {
  try {
    const { instituteId, rollNumber } = req.body;

    if (!instituteId || !rollNumber) {
      return res.status(400).json({ error: 'Institute ID and Roll Number are required' });
    }

    // Find the student
    const student = await Student.findOne({ instituteId, rollNumber });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Find the student's result
    const result = await Result.findOne({ student: student._id })
      .populate('student')
      .populate('subjects.subject');

    if (!result) {
      return res.status(404).json({ error: 'Result not found for this student' });
    }

    // Format the response
    const response = {
      student: {
        name: result.student.name,
        rollNumber: result.student.rollNumber,
        class: result.student.class,
        instituteId: result.student.instituteId
      },
      examDate: result.examDate,
      subjects: result.subjects.map(sub => ({
        name: sub.subject.name,
        marks: sub.marks,
        grade: sub.grade
      })),
      totalMarks: result.totalMarks,
      percentage: result.percentage
    };

    res.json(response);
  } catch (error) {
    console.error('Check result error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};