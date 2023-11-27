
const express = require('express');
const router = express.Router();
const timesheetController = require('../controllers/timesheetController');
const authMiddleware = require('../middleware/authMiddleware');
router.put('/approveTimesheet/:timesheetId', timesheetController.approveTimesheet);
router.put('/pendingTimesheet/:timesheetId', timesheetController.pendingTimesheet)
router.put('/rejectTimesheet/:timesheetId', timesheetController.rejectTimesheet);
router.post('/create',authMiddleware.authenticate, timesheetController.createTimesheet);
router.get('/list',authMiddleware.authenticate, timesheetController.getTimesheetList);

module.exports = router;
