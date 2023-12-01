
const express = require('express');
const router = express.Router();
const timesheetController = require('../controllers/timesheetController');
const authMiddleware = require('../middleware/authMiddleware');
router.put('/approveTimesheet/:timesheetId', timesheetController.approveTimesheet);
router.put('/pendingTimesheet/:timesheetId', timesheetController.pendingTimesheet)
router.put('/rejectTimesheet/:timesheetId', timesheetController.rejectTimesheet);
router.post('/create',authMiddleware.authenticate, timesheetController.createTimesheet);
router.get('/list',authMiddleware.authenticate, timesheetController.getTimesheetList);
router.post('/employee', timesheetController.getTimesheetsByEmployeeAndDateRange);
router.post('/manager', timesheetController.getTimesheetsByManagerAndDateRange )
router.post('/getEmployeesUnderManagerOnSameProject', authMiddleware.authenticate, timesheetController.getEmployeesUnderManagerOnSameProject);
router.post('/getAllTimesheetdata',authMiddleware.authenticate, timesheetController.getAllTimesheetdata)
module.exports = router;




