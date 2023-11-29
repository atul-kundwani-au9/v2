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



const getManagerProfile = async (req, res) => {
  try {
    const { managerId } = req.params;

    const manager = await prisma.employee.findUnique({
      where: {
        EmployeeID: parseInt(managerId),
      },
      include: {
        managingEmployees: {
          select: {
            employee: {
              select: {
                FirstName: true,
                LastName: true,
              },
            },
          },
        },
        Timesheets: {
          select: {
            Project: {
              select: {
                ProjectID: true,
                ProjectName: true,
              },
            },
          },
        },
      },
    });

    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    const managerFirstName = manager.FirstName;
    const managerLastName = manager.LastName;

    const managerProfile = {
      ManagerID: manager.EmployeeID,
      FirstName: managerFirstName,
      LastName: managerLastName,
      Employees: manager.managingEmployees.map((relation) => ({
        FirstName: relation.employee?.FirstName || 'N/A',
        LastName: relation.employee?.LastName || 'N/A',
      })),
      Projects: manager.Timesheets.map((timesheet) => ({
        ProjectID: timesheet.Project.ProjectID,
        ProjectName: timesheet.Project.ProjectName,
      })),
    };

    res.json(managerProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getManagerProfile,
};

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
      let timedata=[];
      let totalHours=0;
         getTimesheet(emp.EmployeeID, startDate, endDate).then((data)=>{
        timedata=data;
      
        timedata.forEach(element => {
         
           totalHours = totalHours + element.HoursWorked
           });
         });        
      
        // if (Array.isArray(time_sheet)) {
        //   obj['hours'] = time_sheet.reduce((a, b) => a + b.HoursWorked, 0);
        // } else {
       
        // }
         obj['hours'] = totalHours;

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
 console.log(employeeId, startDate, endDate)
  const timesheets = await prisma.timesheet.findMany({
    where: {
      EmployeeID: employeeId,
      Date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  console.log(timesheets)
  return timesheets;
}

// const getManagerProfile = async (req, res) => {
//   try {
//     const { managerId } = req.params;

//     const managerEmployee = await managerEmployeeModel.getManagerById(managerId);

//     if (!managerEmployee) {
//       return res.status(404).json({ error: 'Manager not found' });
//     }

//     const managerProfile = {
//       ManagerID: managerEmployee.manager.EmployeeID,
//       ManagerFirstName: managerEmployee.manager.FirstName,
//       ManagerLastName: managerEmployee.manager.LastName,
//       Employees: managerEmployee.employee.map((emp) => ({
//         EmployeeID: emp.EmployeeID,
//         FirstName: emp.FirstName,
//         LastName: emp.LastName,
//       })),
//     };

//     res.json(managerProfile);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
module.exports = {
  getManagerProfile,
  createManagerEmployeesWithHours,  
  createManagerEmployee,
  getManagerEmployees,
};




