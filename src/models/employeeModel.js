
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createEmployee = async (data) => {
  return prisma.employee.create({
    data,
  });
};

const getEmployees = async () => {
  return prisma.employee.findMany();
};

module.exports = {
  createEmployee,
  getEmployees,
};
