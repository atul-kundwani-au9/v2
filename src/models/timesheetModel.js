
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

module.exports = {
  createTimesheet,
  getTimesheets,
};


