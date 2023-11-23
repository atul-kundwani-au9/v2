
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');


router.get('/client/:clientId', reportController.getClientReport);


router.get('/project/:projectId', reportController.getProjectReport);


router.get('/employee/:employeeId', reportController.getEmployeeReport);

module.exports = router;
