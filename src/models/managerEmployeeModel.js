
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createManagerEmployee = async (data) => {
  return prisma.managerEmployee.create({
    data,
  });
};

const getManagerEmployees = async () => {
  return prisma.managerEmployee.findMany({
    include: {
      manager: true,
      employee: true,
    },
  });
};

module.exports = {
  createManagerEmployee,
  getManagerEmployees,
};
