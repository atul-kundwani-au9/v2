

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route for user registration
router.post('/register', employeeController.registerEmployee);
router.post('/login', employeeController.loginEmployee);
router.get('/list', authMiddleware.authenticate, employeeController.getEmployeeList);
router.get('/profile/:employeeId', authMiddleware.authenticate, employeeController.getEmployeeProfile);
module.exports = router;
