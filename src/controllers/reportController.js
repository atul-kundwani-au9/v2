
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getClientReport = async (req, res) => {
  try {
    const clientId = parseInt(req.params.clientId);
    const clientReport = await prisma.timesheet.findMany({
      where: {
        Project: {
          ClientID: clientId,
        },
      },
      include: {
        Employee: true,
        Project: true,
      },
    });
    res.json(clientReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProjectReport = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const projectReport = await prisma.timesheet.findMany({
      where: {
        ProjectID: projectId,
      },
      include: {
        Employee: true,
        Project: true,
      },
    });
    res.json(projectReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getEmployeeReport = async (req, res) => {
  try {
    const employeeId = parseInt(req.params.employeeId);
    const employeeReport = await prisma.timesheet.findMany({
      where: {
        EmployeeID: employeeId,
      },
      include: {
        Employee: true,
        Project: true,
      },
    });
    res.json(employeeReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getClientReport,
  getProjectReport,
  getEmployeeReport,
};
