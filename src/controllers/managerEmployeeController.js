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


   
//     const managerEmployeesWithHours = managerEmployees.map((relation) => {
//       const totalHours = relation.employee.timesheets.reduce(
//         (total, timesheet) => total + timesheet.HoursWorked,
//         0
//       );
//       return {
//         manager: relation.manager,
//         employee: relation.employee,
//         totalHours: totalHours,
//       };
//     });
 
//     res.json(managerEmployeesWithHours);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
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

//     const managerEmployeesWithHours = managerEmployees.map(async (relation) => {
//       const totalHours = relation.employee.timesheets.reduce(
//         (total, timesheet) => total + timesheet.HoursWorked,
//         0
//       );

//       const emps = relation.employee; 
//       const list_of_timesheets = [];

//       for (const emp of emps) {
//         let obj = {
//           emp: emp,
//         };
       
//         let punch_ins = await getTimesheet(emp.emp_id, startDate, endDate);
//         obj['hours'] = punch_ins.reduce((a, b) => a + b.totalHrs, 0);

//         list_of_timesheets.push(obj);
//       }

//       return {
//         manager: relation.manager,
//         employee: relation.employee,
//         totalHours: totalHours,
//         employeeDetails: list_of_timesheets,
//       };
//     });

//     const result = await Promise.all(managerEmployeesWithHours);

//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


// async function getTimesheet(employeeId, startDate, endDate) {
 
//   const timesheets = await prisma.timesheet.findMany({
//     where: {
//       EmployeeID: employeeId,
//       Date: {
//         gte: startDate,
//         lte: endDate,
//       },
//     },
//   });
//   return timesheets;
// }
const createManagerEmployeesWithHours = async (req, res) => {
  try {
    const { managerId, startDate, endDate } = req.body;

    const managerEmployees = await prisma.managerEmployee.findMany({
      where: {
        managerId: parseInt(managerId),
      },
      include: {
        manager: true,
        employee: true,
      },
    });

    const managerEmployeesWithHours = managerEmployees.map((relation) => {
      const totalHours = (relation.employee?.timesheets || []).reduce(
        (total, timesheet) => total + timesheet.HoursWorked,
        0
      );
      
      const emps = Array.isArray(relation.employee) ? relation.employee : [relation.employee];
      const list_of_timesheets = [];
      for (const emp of emps) {
        let obj = {
          emp: emp,
        };       
        let time_sheet = getTimesheet(emp.emp_id, startDate, endDate);        
        
        if (Array.isArray(time_sheet)) {
          obj['hours'] = time_sheet.reduce((a, b) => a + b.totalHrs, 0);
        } else {
          obj['hours'] = 0;
        }

        list_of_timesheets.push(obj);
      }

      return {
        manager: relation.manager,
        employee: relation.employee,
        totalHours: totalHours,
        employeeDetails: list_of_timesheets,
      };
    });

    res.json(managerEmployeesWithHours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


async function getTimesheet(employeeId, startDate, endDate) {
 
  const timesheets = await prisma.timesheet.findMany({
    where: {
      EmployeeID: employeeId,
      Date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  return timesheets;
}


module.exports = {
  createManagerEmployeesWithHours,
 
  createManagerEmployee,
  getManagerEmployees,
};




