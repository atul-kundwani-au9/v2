
const express = require('express');
const router = express.Router();
const managerEmployeeController = require('../controllers/managerEmployeeController');

router.post('/createManagerEmployee', managerEmployeeController.createManagerEmployee);
router.get('/getManagerEmployees', managerEmployeeController.getManagerEmployees);

module.exports = router;
