const timesheetModel = require('../models/timesheetModel');

const createTimesheet = async (req, res) => {
  try {
    const { EmployeeID, ProjectID, Status, HoursWorked, Description } = req.body;

    
    const currentDate = new Date().toISOString();

   
    const timesheetData = {
      EmployeeID,
      ProjectID,
      Date: currentDate,
      Status,
      HoursWorked,
      Description,
    };

    const timesheet = await timesheetModel.createTimesheet(timesheetData);
    res.json(timesheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTimesheetList = async (req, res) => {
  try {
    const timesheets = await timesheetModel.getTimesheets();
    res.json(timesheets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createTimesheet,
  getTimesheetList,
};
