const express = require('express');
const router = express.Router();
const exportController = require('../controller/exportController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Export routes
router.get('/students', exportController.exportStudents);
router.get('/results', exportController.exportResults);

module.exports = router;
