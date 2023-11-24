
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createEmployee = async (data) => {
  return prisma.employee.create({
    data,
  });
};
const getEmployeeByEmail = async (email) => {
  return prisma.employee.findUnique({
    where: {
      Email: email,
    },
  });
};

const getEmployees = async () => {
  return prisma.employee.findMany();
};

module.exports = {
  createEmployee,
  getEmployeeByEmail,
  getEmployees,
};
