const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Student CRUD operations
router.post('/', studentController.createStudent);
router.get('/', studentController.getStudents);
router.get('/roll/:rollNumber', studentController.getStudentByRoll);
router.delete('/:id', studentController.deleteStudent);

// Bulk upload route
const upload = require('../middleware/upload');
router.post('/bulk-upload', upload.single('file'), studentController.bulkUpload);

module.exports = router;
