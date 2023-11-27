const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createManagerEmployee = async (req, res) => {
    try {
      const { managerId, employeeId } = req.body;
  
      
      const managerIdInt = parseInt(managerId, 10);
      const employeeIdInt = parseInt(employeeId, 10);
  
     
      const managerExists = await prisma.employee.findUnique({
        where: { EmployeeID: managerIdInt },
      });
  
      const employeeExists = await prisma.employee.findUnique({
        where: { EmployeeID: employeeIdInt },
      });
  
      if (!managerExists || !employeeExists) {
        return res.status(404).json({ error: 'Manager or Employee not found' });
      }
  
      
      const managerEmployee = await prisma.managerEmployee.create({
        data: {
          manager: { connect: { EmployeeID: managerIdInt } },
          employee: { connect: { EmployeeID: employeeIdInt } },
        },
      });
     
      res.json(managerEmployee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

const getManagerEmployees = async (req, res) => {
  try {
    const managerEmployees = await prisma.managerEmployee.findMany({
      include: {
        manager: true,
        employee: true,
      },
    });
    
    res.json(managerEmployees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createManagerEmployee,
  getManagerEmployees,
};




// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const createManagerEmployee = async (req, res) => {
//   try {
//     const { managerId, employeeId } = req.body;

//     const managerIdInt = parseInt(managerId, 10);
//     const employeeIdInt = parseInt(employeeId, 10);

//     const managerExists = await prisma.employee.findUnique({
//       where: { EmployeeID: managerIdInt },
//     });

//     const employeeExists = await prisma.employee.findUnique({
//       where: { EmployeeID: employeeIdInt },
//     });

//     if (!managerExists || !employeeExists) {
//       return res.status(404).json({ error: 'Manager or Employee not found' });
//     }

//     const managerEmployee = await prisma.managerEmployee.create({
//       data: {
//         manager: { connect: { EmployeeID: managerIdInt } },
//         employee: { connect: { EmployeeID: employeeIdInt } },
//       },
//     });

//     res.json(managerEmployee);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const getManagerEmployees = async (req, res) => {
//   try {
//     const managerEmployees = await prisma.managerEmployee.findMany({
//       include: {
//         manager: true,
//         employee: {
//           include: {
//             Timesheets: {
//               where: {
//                 Status: 'approved', 
//               },
//               select: {
//                 HoursWorked: true,
//               },
//             },
//           },
//         },
//       },
//     });

    
//     const managerEmployeesWithTotalTime = managerEmployees.map((managerEmployee) => {
//       const totalHoursWorked = managerEmployee.employee.Timesheets.reduce(
//         (total, timesheet) => total + timesheet.HoursWorked,
//         0
//       );

//       return {
//         managerEmployee,
//         totalHoursWorked,
//       };
//     });

//     res.json(managerEmployeesWithTotalTime);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// module.exports = {
//   createManagerEmployee,
//   getManagerEmployees,
  
// };
