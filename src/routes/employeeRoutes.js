
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.post('/register', employeeController.registerEmployee);
router.get('/list', employeeController.getEmployeeList);

module.exports = router;


