
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const createTimesheet = async (data) => {
//   return prisma.timesheet.create({
//     data,
//     Date,
//   });
// };

// const getTimesheets = async () => {
//   return prisma.timesheet.findMany({
//     include: {
//       Employee: true,
//       Project: true,
     
//     },
//   });
// };

// module.exports = {
//   createTimesheet,
//   getTimesheets,
// };

// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const createTimesheet = async (data) => {
//   const currentDateTime = new Date().toISOString();

//   return prisma.timesheet.create({
//     data: {
//       ...data,
//       Date: currentDateTime,
//     },
//   });
// };

// const getTimesheets = async () => {
//   return prisma.timesheet.findMany({
//     include: {
//       Employee: true,
//       Project: true,
//     },
//   });
// };

// module.exports = {
//   createTimesheet,
//   getTimesheets,
// };

// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const createTimesheet = async (data) => {
  
//   return prisma.timesheet.create({
//     data,
   
//   });
// };

// const getTimesheets = async () => {
//   return prisma.timesheet.findMany({
//     include: {
//       Employee: true,
//       Project: true,
//     },
//   });
// };

// module.exports = {
//   createTimesheet,
//   getTimesheets,
// };


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTimesheet = async (data) => {
  return prisma.timesheet.create({
    data,
  });
};

const getTimesheets = async () => {
  return prisma.timesheet.findMany({
    include: {
      Employee: true,
      Project: true,
    },
  });
};


const getTimesheetsByEmployeeAndDateRange = async (employeeId, startDate, endDate) => {
  return prisma.timesheet.findMany({
    where: {
     
      EmployeeID: employeeId,
      Date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      Employee: true,
      Project: true,
    },
  });
};

module.exports = {
  createTimesheet,
  getTimesheets,
  getTimesheetsByEmployeeAndDateRange,
};
