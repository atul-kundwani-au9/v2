
// const express = require('express');
// const router = express.Router();
// const employeeController = require('../controllers/employeeController');

// router.post('/register', employeeController.registerEmployee);
// router.get('/list', employeeController.getEmployeeList);

// module.exports = router;


const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route for user registration
router.post('/register', employeeController.registerEmployee);
router.post('/login', employeeController.loginEmployee);
// Protected route for getting the employee list
router.get('/list', authMiddleware.authenticate, employeeController.getEmployeeList);

module.exports = router;
