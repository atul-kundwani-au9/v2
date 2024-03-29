
const express = require('express');
const router = express.Router();
const managerEmployeeController = require('../controllers/managerEmployeeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/createManagerEmployee',authMiddleware.authenticate, managerEmployeeController.createManagerEmployee);
router.get('/getManagerEmployees',authMiddleware.authenticate, managerEmployeeController.getManagerEmployees);
router.post('/createManagerEmployeesWithHours', managerEmployeeController.createManagerEmployeesWithHours);
router.get('/getManagerProfile/:managerId', authMiddleware.authenticate, managerEmployeeController.getManagerProfile);
router.get('/getManagers', authMiddleware.authenticate, managerEmployeeController.getManagers);
router.post('/csv-data', managerEmployeeController.exportCSV);
router.post('/csv-employee',managerEmployeeController.exportEmployeeCSV)
router.post('/csv-employees',managerEmployeeController.exportEmployeesCSV)
// router.post('/export-employees-excel', managerEmployeeController.exportEmployeesExcel)
router.post('/export-employees-csv',managerEmployeeController.exportEmployeeCSVs)
router.get('/managerData/:managerId', authMiddleware.authenticate, managerEmployeeController.getManagerData);
// router.get('/user-leaves/:employeeId',managerEmployeeController.getUserLeaves)
module.exports = router;



