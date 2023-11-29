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

    const managerEmployeesWithHours = managerEmployees.map((relation) => {
      const totalHours = (relation.employee?.timesheets || []).reduce(
        (total, timesheet) => total + timesheet.HoursWorked,
        0
      );
      
      const emps = Array.isArray(relation.employee) ? relation.employee : [relation.employee];
      const list_of_timesheets = [];
      // for (const emp of emps) {
      //   let obj = {
      //     emp: emp,
      //   };   
      // let timedata=[];
      // let totalHours=0;
      //    getTimesheet(emp.EmployeeID, startDate, endDate).then((data)=>{
      //   timedata=data;
      
      //   timedata.forEach(element => {
         
      //      totalHours = totalHours + element.HoursWorked
      //      });
      //    });        
      
      //   // if (Array.isArray(time_sheet)) {
      //   //   obj['hours'] = time_sheet.reduce((a, b) => a + b.HoursWorked, 0);
      //   // } else {
       
      //   // }
      //    obj['hours'] = totalHours;

      //   list_of_timesheets.push(obj);
      // }
      for (const emp of emps) {
        let obj = {
          emp: emp,
        };
        let timedata = [];
        
        let totalHours = 0;
        const timeData = getTimesheet(emp.EmployeeID, startDate, endDate).then((data) => {
          timedata = data;
          timedata.forEach(element => {
            totalHours += element.HoursWorked || 0
          });
        }).finally(()=>{
        
        
          obj['hours'] = totalHours;
        })
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


module.exports = {
  getManagerProfile,
  createManagerEmployeesWithHours,  
  createManagerEmployee,
  getManagerEmployees,
};




