const express = require('express');
const router = express.Router();
const subjectController = require('../controller/subjectController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', subjectController.createSubject);
router.get('/', subjectController.getSubjects);
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;
