
const { PrismaClient } = require('@prisma/client');
const timesheetModel = require('../models/timesheetModel');
const prisma = new PrismaClient();

const createTimesheet = async (req, res) => {
  console.log(req.body)
  try {
    const { EmployeeID, ProjectID, entryDate,Status,Description, HoursWorked } = req.body;

    console.log('entryDate:', entryDate);
    const existingEmployee = await prisma.employee.findUnique({
      where: {
        EmployeeID: EmployeeID,
        
      },
    });
     
    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' });    }          
    const timesheetData = {
      EmployeeID,
      ProjectID,
      Date:TempDate,      
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

const getAllTimesheetdata = async (req, res) => {
  try {
    const { EmployeeID, startDate, endDate } = req.body;   
    const existingEmployee = await prisma.employee.findMany({
      where: {
        EmployeeID: EmployeeID,
      },
    });
     
    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }     
      const dummyTimesheet = {
        EmployeeID: EmployeeID,
        ProjectID: 1, 
        Date: randomDate(new Date(startDate),new Date(endDate),0,0), 
        Status: 'submitted', 
        HoursWorked: Math.floor(Math.random() * 8) + 1, 
        Description: 'Random Description',
      };        
      const createdTimesheet = await prisma.timesheet.create({        
        data: dummyTimesheet,
      });      
    
    res.json(dummyTimesheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return date;
}
}

const getTimesheetList = async (req, res) => {
  try {
    const timesheets = await timesheetModel.getTimesheets();
    res.json(timesheets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTimesheetsByEmployeeAndDateRange = async (req, res) => {
  
  try {

    const { employeeId, startDate, endDate } = req.body;
    const timesheets = await timesheetModel.getTimesheetsByEmployeeAndDateRange(
      parseInt(employeeId),
      new Date(startDate),
      new Date(endDate)
    );
    res.json(timesheets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const approveTimesheet = async (req, res) => {
  try {
    const { timesheetId } = req.params;

    const updatedTimesheet = await prisma.timesheet.update({
      where: {
        TimesheetID: parseInt(timesheetId, 10),
      },
      data: {
        Status: 'approved',
      },
    });

    res.json(updatedTimesheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};
const pendingTimesheet = async (req, res) => {
  try {
    const { timesheetId } = req.params;

    const updatedTimesheet = await prisma.timesheet.update({
      where: {
        TimesheetID: parseInt(timesheetId, 10),
      },
      data: {
        Status: 'pending',
      },
    });

    res.json(updatedTimesheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
};

const rejectTimesheet = async (req, res) => {
  try {
    const { timesheetId } = req.params;

    const updatedTimesheet = await prisma.timesheet.update({
      where: {
        TimesheetID: parseInt(timesheetId, 10),
      },
      data: {
        Status: 'rejected',
      },
    });

    res.json(updatedTimesheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
}


// const updateTimesheetsStatus = async (timesheetIds, status) => {
//   try {
//     const updatedTimesheets = await prisma.timesheet.updateMany({
//       where: {
//         TimesheetID: {
//           in: timesheetIds.map(id => parseInt(id, 10)),
//         },
//       },
//       data: {
//         Status: status,
//       },
//     });

//     return updatedTimesheets;
//   } catch (error) {
//     console.error(error);
//     throw new Error('Internal Server Error');
//   }
// };

// const approveTimesheets = async (req, res) => {
//   try {
//     const { timesheetIds } = req.body;

//     const updatedTimesheets = await updateTimesheetsStatus(timesheetIds, 'approved');

//     res.json(updatedTimesheets);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const pendingTimesheets = async (req, res) => {
//   try {
//     const { timesheetIds } = req.body;

//     const updatedTimesheets = await updateTimesheetsStatus(timesheetIds, 'pending');

//     res.json(updatedTimesheets);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const rejectTimesheets = async (req, res) => {
//   try {
//     const { timesheetIds } = req.body;

//     const updatedTimesheets = await updateTimesheetsStatus(timesheetIds, 'rejected');

//     res.json(updatedTimesheets);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
const getEmployeesUnderManagerOnSameProject = async (req, res) => {
  try {
    const { managerId, employeeId, projectId, startDate, endDate } = req.body;    
    const managerExists = await prisma.employee.findUnique({
      where: { EmployeeID: managerId },
    });

    const employeeExists = await prisma.employee.findUnique({
      where: { EmployeeID: employeeId },
    });

    if (!managerExists || !employeeExists) {
      return res.status(404).json({ error: 'Manager or Employee not found' });
    }
    
    const employeesList = await prisma.managerEmployee.findMany({
      where: {
        managerId: managerId,
      },
      include: {
        manager: true,
        employee: {
          where: {
            EmployeeID: { not: employeeId }, 
          },
          include: {
            timesheets: {
              where: {
                ProjectID: projectId,
                Date: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
          },
        },
      },
    });
    const result = employeesList.map((relation) => {
      const totalHours = (relation.employee?.timesheets || []).reduce(
        (total, timesheet) => total + timesheet.HoursWorked,
        0
      );

      return {
        manager: relation.manager,
        employee: relation.employee,
        totalHours: totalHours,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getEmployeesUnderManagerOnSameProject,
  getTimesheetsByEmployeeAndDateRange,
  pendingTimesheet,
  createTimesheet,
  getTimesheetList,
  approveTimesheet,
  rejectTimesheet,
  getAllTimesheetdata,
  }
  
