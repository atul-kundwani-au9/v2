
const { PrismaClient } = require('@prisma/client');
const timesheetModel = require('../models/timesheetModel');
const prisma = new PrismaClient();
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const express = require('express');
const router = require('../routes/timesheetRoutes');
const app = express();
const createTimesheets = async (req, res) => {
  try {
    const timesheetEntries = req.body.timesheets; 

    const results = await Promise.all(
      timesheetEntries.map(async (entry) => {
        const { EmployeeID, ProjectID, entryDate, Status, Description, HoursWorked, EntryType } = entry;

        const existingEmployee = await prisma.employee.findUnique({
          where: {
            EmployeeID: EmployeeID,
          },
        });

        if (!existingEmployee) {
          return { error: `Employee with ID ${EmployeeID} not found` };
        }
        const date = new Date(entryDate);
     
        if (EntryType === 'weekly') {       
        } else if (EntryType === 'monthly') {         
        }
        const timesheetData = {
          EmployeeID,
          ProjectID,
          Date: date,
          Status,
          HoursWorked,
          Description,
        };

        const timesheet = await timesheetModel.createTimesheet(timesheetData);
        return timesheet;
      })
    );
    
    res.json(results);
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
const getTimesheetsByManagerAndDateRange = async (req, res) => {  
  try {
    const { managerId, startDate, endDate } = req.body;
    const timesheets = await timesheetModel.getTimesheetsByManagerAndDateRange(
      parseInt(managerId),
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

    // employee id, date range

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
const getEmployeesUnderManagerOnSameProject = async (req, res) => {
  try {
    const { managerId, employeeId, projectId, startDate, endDate,clientId } = req.body;
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
          
          include: {
            Timesheets: {
              where: {
                ProjectID: projectId,
                Date: {
                  gte: new Date(startDate),
                  lte: new Date(endDate),
                },
              },
            },
          },
        },
      },
    });

    const result = employeesList.map((relation) => {
      const totalHours = (relation.employee?.Timesheets || []).reduce(
        (total, timesheet) => total + timesheet.HoursWorked,
        0
      );

      return {
        manager: relation.manager,
        employee: relation.employee,
        totalHours: totalHours,
        clientId: clientId, 
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// const createManagerEmployeesWithHours = async (req, res) => {
//   try {
//     const { managerId, startDate, endDate } = req.body;

//     const managerEmployees = await prisma.managerEmployee.findMany({
//       where: {
//         managerId: parseInt(managerId),
//       },
//       include: {
//         manager: true,
//         employee: true,
//       },
//     });
//     // 
//     const managerEmployeesWithHours = await Promise.all(managerEmployees.map(async (relation) => {
//       const emps = Array.isArray(relation.employee) ? relation.employee : [relation.employee];
//       const list_of_timesheets = [];
    
//       for (const emp of emps) {
//         let obj = {
//           emp: emp,
//         };
//         let timedata = [];
    
//         try {
//           const data = await getTimesheet(emp.EmployeeID, startDate, endDate);
//           timedata = data;
    
//           timedata.forEach(element => {
//             obj['hours'] = (obj['hours'] || 0) + (element.HoursWorked || 0);
//           });
    
//           list_of_timesheets.push(obj);
//         } catch (error) {
//           console.error(`Error fetching timesheet for EmployeeID ${emp.EmployeeID}:`, error);
//         }
//       }
    
//       return list_of_timesheets;
//     }));
    

//     res.json(managerEmployeesWithHours);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


// async function getTimesheet(employeeId, startDate, endDate) {
//  console.log(employeeId, startDate, endDate)
//   const timesheets = await prisma.timesheet.findMany({
//     where: {
//       EmployeeID: employeeId,
//       Date: {
//         gte: new Date(startDate) ,
//         lte: new Date(endDate),
//       },
//     },
//   });
//   console.log(timesheets)
//   return timesheets;
// }
// const csvdata = async (req,res)=> {
// // app.get('/export-csv', async (req, res) => {
//   try {    
//     const employeesData = await getEmployeesUnderManagerOnSameProject(req, res);
//     // const managerEmployeesWithHoursData = await createManagerEmployeesWithHours(req, res);   
//     const combinedData = [...employeesData];
    
//     const csvWriter = createCsvWriter({
//       path: 'output.csv',
//       header: [
//         { id: 'manager.name', title: 'Manager Name' },
//         { id: 'employee.name', title: 'Employee Name' },
//         { id: 'totalHours', title: 'Total Hours Worked' },
//         { id: 'clientId', title: 'Client ID' },
//       ],
//     });
   
//     csvWriter.writeRecords(combinedData).then(() => {
//       console.log('CSV file has been written successfully');
//       res.download('output.csv'); 
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }

// }

module.exports = {    
  getTimesheetsByManagerAndDateRange,
  getEmployeesUnderManagerOnSameProject,
  getTimesheetsByEmployeeAndDateRange,
  pendingTimesheet,
  createTimesheets,
  getTimesheetList,
  approveTimesheet,
  rejectTimesheet,
  getAllTimesheetdata,
  }
  
