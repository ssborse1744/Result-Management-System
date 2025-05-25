const express = require('express');
const router = express.Router();
const resultController = require('../controller/resultController');
const authMiddleware = require('../middleware/auth');

// Public route for checking results
router.post('/check', resultController.checkResult);

// Apply auth middleware to protected routes
router.use(authMiddleware);

// Protected result management routes
router.post('/', resultController.createResult);
router.get('/', resultController.getResults);
router.get('/student/:rollNumber', resultController.getResultByStudent);
router.delete('/:id', resultController.deleteResult);

module.exports = router;
