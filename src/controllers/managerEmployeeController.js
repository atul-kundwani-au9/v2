const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createManagerEmployee = async (req, res) => {
    try {
      const { managerId, employeeId } = req.body;
  
      
      const managerIdInt = parseInt(managerId);
      const employeeIdInt = parseInt(employeeId);  
     
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
    // 
    const managerEmployeesWithHours = await Promise.all(managerEmployees.map(async (relation) => {
      const emps = Array.isArray(relation.employee) ? relation.employee : [relation.employee];
      const list_of_timesheets = [];
    
      for (const emp of emps) {
        let obj = {
          emp: emp,
        };
        let timedata = [];
    
        try {
          const data = await getTimesheet(emp.EmployeeID, startDate, endDate);
          timedata = data;
    
          timedata.forEach(element => {
            obj['hours'] = (obj['hours'] || 0) + (element.HoursWorked || 0);
          });
    
          list_of_timesheets.push(obj);
        } catch (error) {
          console.error(`Error fetching timesheet for EmployeeID ${emp.EmployeeID}:`, error);
        }
      }
    
      return list_of_timesheets;
    }));
    //   return {
    //     manager: relation.manager,
    //     employee: relation.employee,
    //     totalHours: totalHours,
    //     employeeDetails: list_of_timesheets,
    //   };
    // });

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
        gte: new Date(startDate) ,
        lte: new Date(endDate),
      },
    },
  });
  console.log(timesheets)
  return timesheets;
}


module.exports = {
  
  getManagerProfile,
  createManagerEmployeesWithHours,  
  createManagerEmployee,
  getManagerEmployees,
};




