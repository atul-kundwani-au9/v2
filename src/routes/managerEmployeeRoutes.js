
const express = require('express');
const router = express.Router();
const managerEmployeeController = require('../controllers/managerEmployeeController');
const authMiddleware = require('../middleware/authMiddleware');
router.post('/createManagerEmployee',authMiddleware.authenticate, managerEmployeeController.createManagerEmployee);
router.get('/getManagerEmployees',authMiddleware.authenticate, managerEmployeeController.getManagerEmployees);

module.exports = router;
