const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');

router.get('/get', authMiddleware.authenticate, taskController.getAllTasks);
router.post('/create', authMiddleware.authenticate, taskController.createTask);
router.post('/project-details', authMiddleware.authenticate, taskController.getProjectDetails);
module.exports = router;

