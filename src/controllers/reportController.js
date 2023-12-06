
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getClientReport = async (req, res) => {
  try {
    const clientId = parseInt(req.params.clientId);
    const clientReport = await prisma.timesheet.findMany({
      where: {
        Project: {
          ClientID: clientId,
        },
      },
      include: {
        Employee: true,
        Project: true,
      },
    });
    const status = "success";
    res.json(clientReport,status);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProjectReport = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const projectReport = await prisma.timesheet.findMany({
      where: {
        ProjectID: projectId,
      },
      include: {
        Employee: true,
        Project: true,
      },
    });
    
    res.json(projectReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getEmployeeReport = async (req, res) => {
  try {
    const employeeId = parseInt(req.params.employeeId);
    const employeeReport = await prisma.timesheet.findMany({
      where: {
        EmployeeID: employeeId,
      },
      include: {
        Employee: true,
        Project: true,
      },
    });
    
    res.json(employeeReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// const getManagerReport = async (req, res) => {
//   try {
//     const { managerId, startDate, endDate } = req.body;
//     const managedEmployees = await prisma.managerEmployee.findMany({
//       where: {
//         managerId: parseInt(managerId),
//       },
//       select: {
//         employeeId: true,
//       },
//     });

//     const managedEmployeeIds = managedEmployees.map((entry) => entry.employeeId);
    
//     const submittedTimesheets = await prisma.timesheet.findMany({
//       where: {
//         EmployeeID: {
//           in: managedEmployeeIds,
//         },
//         Date: {
//           gte: new Date(startDate),
//           lte: new Date(endDate),
//         },
//         Status: 'submitted',
//       },
//       distinct: ['EmployeeID'],
//     });
    
//     const submittedEmployeeIds = submittedTimesheets.map((timesheet) => timesheet.EmployeeID);
//     const submittedEmployees = await prisma.employee.findMany({
//       where: {
//         EmployeeID: {
//           in: submittedEmployeeIds,
//         },
//       },
//     });
   
//     const updatedSubmittedTimesheets = await prisma.timesheet.findMany({
//       where: {
//         EmployeeID: {
//           in: managedEmployeeIds,
//         },
//         Date: {
//           gte: new Date(startDate),
//           lte: new Date(endDate),
//         },
//         Status: 'submitted',
//       },
//       distinct: ['EmployeeID'],
//     });
    
//     const updatedSubmittedEmployeeIds = updatedSubmittedTimesheets.map((timesheet) => timesheet.EmployeeID);
//     const updatedSubmittedEmployees = await prisma.employee.findMany({
//       where: {
//         EmployeeID: {
//           in: updatedSubmittedEmployeeIds,
//         },
//       },
//     });

//     const notSubmittedEmployees = await prisma.employee.findMany({
//       where: {
//         EmployeeID: {
//           in: managedEmployeeIds,
//           notIn: updatedSubmittedEmployeeIds,
//         },
//       },
//     });

//     const response = {
//       submittedEmployees: updatedSubmittedEmployees,
//       notSubmittedEmployees: notSubmittedEmployees,
//       totalSubmitted: updatedSubmittedEmployees.length,
//       totalNotSubmitted: notSubmittedEmployees.length,
//       status: 'success',
//     };

//     res.json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// const getManagerReport = async (req, res) => {
//   try {
//     const { managerId, startDate, endDate } = req.body;

//     const managedEmployees = await prisma.managerEmployee.findMany({
//       where: {
//         managerId: parseInt(managerId),
//       },
//       select: {
//         employeeId: true,
//       },
//     });

//     const managedEmployeeIds = managedEmployees.map((entry) => entry.employeeId);    
//     const submittedTimesheets = await prisma.timesheet.findMany({
//       where: {
//         EmployeeID: {
//           in: managedEmployeeIds,
//         },
//         Date: {
//           gte: new Date(startDate),
//           lte: new Date(endDate),
//         },
//         Status: 'submitted',
//       },
//       distinct: ['EmployeeID'],
//     });

   
//     const submittedEmployeeIds = submittedTimesheets.map((timesheet) => timesheet.EmployeeID);
//     const submittedEmployees = await prisma.employee.findMany({
//       where: {
//         EmployeeID: {
//           in: submittedEmployeeIds,
//         },
//       },
//     });
    
//     const updatedSubmittedTimesheets = await prisma.timesheet.findMany({
//       where: {
//         EmployeeID: {
//           in: managedEmployeeIds,
//         },
//         Date: {
//           gte: new Date(startDate),
//           lte: new Date(endDate),
//         },
//         Status: 'submitted',
//       },
//       distinct: ['EmployeeID'],
//     });
  
//     const updatedSubmittedEmployeeIds = updatedSubmittedTimesheets.map((timesheet) => timesheet.EmployeeID);
//     const updatedSubmittedEmployees = await prisma.employee.findMany({
//       where: {
//         EmployeeID: {
//           in: updatedSubmittedEmployeeIds,
//         },
//       },
//     });

//     const notSubmittedEmployees = await prisma.employee.findMany({
//       where: {
//         EmployeeID: {
//           in: managedEmployeeIds,
//           notIn: updatedSubmittedEmployeeIds,
//         },
//       },
//     });

//     const response = {
//       submittedEmployees: updatedSubmittedEmployees,
//       notSubmittedEmployees: notSubmittedEmployees,
//       totalSubmitted: updatedSubmittedTimesheets.length, // Use the correct count
//       totalNotSubmitted: notSubmittedEmployees.length,
//       status: 'success',
//     };

//     res.json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
const getManagerReport = async (req, res) => {
  try {
    const { managerId, startDate, endDate } = req.body;

    const managedEmployees = await prisma.managerEmployee.findMany({
      where: {
        managerId: parseInt(managerId),
      },
      select: {
        employeeId: true,
      },
    });

    const managedEmployeeIds = managedEmployees.map((entry) => entry.employeeId);
    console.log('Managed Employee IDs:', managedEmployeeIds);
    const submittedTimesheets = await prisma.timesheet.findMany({
      where: {
        EmployeeID: {
          in: managedEmployeeIds,
        },
        Date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        Status: 'submitted',
      },
    });
    console.log('Submitted Timesheets:', submittedTimesheets);
    const allEmployees = await prisma.employee.findMany();

    const submittedEmployeeIds = submittedTimesheets.map((timesheet) => timesheet.EmployeeID);

    const submittedEmployees = allEmployees.filter((employee) =>
      submittedEmployeeIds.includes(employee.EmployeeID)
    );

    const notSubmittedEmployees = allEmployees.filter(
      (employee) => !submittedEmployeeIds.includes(employee.EmployeeID)
    );

    const response = {
      submittedEmployees: submittedEmployees,
      notSubmittedEmployees: notSubmittedEmployees,
      totalSubmitted: submittedTimesheets.length, 
      totalNotSubmitted: notSubmittedEmployees.length,
      status: 'success',
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getManagerReport,
  getClientReport,
  getProjectReport,
  getEmployeeReport,
};
