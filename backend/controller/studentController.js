const Student = require('../models/Student');
const csvParser = require('../utils/csvParser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { rollNumber, name, class: studentClass } = req.body;
    const instituteId = req.user.instituteId;

    // Check if student already exists
    const existingStudent = await Student.findOne({ rollNumber, instituteId });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student with this roll number already exists' });
    }

    const student = new Student({
      rollNumber,
      name,
      class: studentClass,
      instituteId
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    const students = await Student.find({ instituteId })
      .sort({ rollNumber: 1 }); // Sort by roll number ascending
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a student by roll number
exports.getStudentByRoll = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const instituteId = req.user.instituteId;

    const student = await Student.findOne({ rollNumber, instituteId });
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const instituteId = req.user.instituteId;

    const student = await Student.findOneAndDelete({ _id: id, instituteId });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Bulk upload students
exports.bulkUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const instituteId = req.user.instituteId;
    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    let students = [];

    // Parse file based on extension
    if (fileExt === '.csv') {
      // Parse CSV file
      students = await csvParser(filePath);
    } else if (fileExt === '.xlsx' || fileExt === '.xls') {
      // Parse Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      students = xlsx.utils.sheet_to_json(worksheet);
    } else {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported file format. Please upload CSV or Excel file.' });
    }

    if (!students || students.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'No valid data found in the file' });
    }

    // Validate and transform data
    const transformedStudents = students.map(student => ({
      rollNumber: student['Roll Number'] || student.rollNumber,
      name: student['Name'] || student.name,
      class: student['Class'] || student.class,
      instituteId
    }));

    // Validate required fields
    const invalidEntries = transformedStudents.filter(
      student => !student.rollNumber || !student.name || !student.class
    );

    if (invalidEntries.length > 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        error: 'Invalid data format. Each student must have Roll Number, Name, and Class' 
      });
    }

    // Check for duplicate roll numbers in file
    const rollNumbers = transformedStudents.map(s => s.rollNumber);
    if (new Set(rollNumbers).size !== rollNumbers.length) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Duplicate roll numbers found in file' });
    }

    // Check for existing students
    const existingStudents = await Student.find({
      rollNumber: { $in: rollNumbers },
      instituteId
    });

    if (existingStudents.length > 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        error: `Some students already exist with roll numbers: ${existingStudents.map(s => s.rollNumber).join(', ')}` 
      });
    }

    // Insert all students
    await Student.insertMany(transformedStudents);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({ 
      success: true,
      count: transformedStudents.length,
      message: `Successfully uploaded ${transformedStudents.length} students` 
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    // Clean up uploaded file if it exists
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to process file upload' });
  }
};