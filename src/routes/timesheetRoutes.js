
const express = require('express');
const router = express.Router();
const timesheetController = require('../controllers/timesheetController');

router.post('/create', timesheetController.createTimesheet);
router.get('/list', timesheetController.getTimesheetList);

module.exports = router;
