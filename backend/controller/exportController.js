const XLSX = require('xlsx');
const Student = require('../models/Student');
const Result = require('../models/Result');
const fs = require('fs');
const path = require('path');

// Helper function to convert data to CSV string
const convertToCSV = (data) => {
  if (data.length === 0) return '';
  
  const header = Object.keys(data[0]).join(',') + '\n';
  const rows = data.map(obj => 
    Object.values(obj).map(val => 
      typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
    ).join(','),
  ).join('\n');
  
  return header + rows;
};

// Export all students
exports.exportStudents = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    const format = req.query.format || 'xlsx'; // Default to xlsx if not specified
    
    // Get all students for this institute
    const students = await Student.find({ instituteId });

    // Format data for export
    const data = students.map(student => ({
      'Roll_Number': student.rollNumber,
      'Name': student.name,
      'Class': student.class,
      'Added_On': student.createdAt.toLocaleDateString()
    }));

    if (format === 'csv') {
      // CSV Export
      const csvContent = convertToCSV(data);
      const fileName = `students_export_${Date.now()}.csv`;
      const filePath = path.join(__dirname, '../uploads', fileName);
      
      // Write to file
      fs.writeFileSync(filePath, csvContent);
      
      // Send file
      res.download(filePath, fileName, (err) => {
        // Delete the file after sending
        fs.unlinkSync(filePath);
        if (err) {
          console.error('Error downloading file:', err);
        }
      });
    } else {
      // Excel Export
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Students');
      
      // Generate buffer
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      
      // Set headers for file download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=students_export_${Date.now()}.xlsx`);
      res.send(buffer);
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Error exporting data', error: error.message });
  }
};

// Export results
exports.exportResults = async (req, res) => {
  try {
    const instituteId = req.user.instituteId;
    const format = req.query.format || 'xlsx';
    
    // Get all results for this institute
    const results = await Result.find({ instituteId })
      .populate('student')
      .populate('subjects.subject');

    // Format data for export
    const data = results.map(result => {
      const baseData = {
        'Roll_Number': result.student.rollNumber,
        'Student_Name': result.student.name,
        'Class': result.student.class,
        'Exam_Date': result.examDate.toLocaleDateString(),
        'Total_Marks': result.totalMarks,
        'Percentage': result.percentage
      };

      // Add subject marks
      result.subjects.forEach(sub => {
        baseData[`${sub.subject.name}_Marks`] = sub.marks;
      });

      return baseData;
    });

    if (format === 'csv') {
      // CSV Export
      const csvContent = convertToCSV(data);
      const fileName = `results_export_${Date.now()}.csv`;
      const filePath = path.join(__dirname, '../uploads', fileName);
      
      // Write to file
      fs.writeFileSync(filePath, csvContent);
      
      // Send file
      res.download(filePath, fileName, (err) => {
        // Delete the file after sending
        fs.unlinkSync(filePath);
        if (err) {
          console.error('Error downloading file:', err);
        }
      });
    } else {
      // Excel Export
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Results');
      
      // Generate buffer
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      
      // Set headers for file download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=results_export_${Date.now()}.xlsx`);
      res.send(buffer);
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Error exporting data', error: error.message });
  }
};
