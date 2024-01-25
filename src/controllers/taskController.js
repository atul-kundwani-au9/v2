const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const taskModel = require('../models/taskModel');


const taskController = {
    getAllTasks: async (req, res) => {
      try {
        const tasks = await prisma.task.findMany();
        res.json({ status: 'success', data: tasks });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    },
  
    createTask: async (req, res) => {
        try {
            const { projectId, taskName, Hours,EmployeeID } = req.body;

            if (!projectId || !taskName || !EmployeeID) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const isManager = true;
            const timestamp = new Date().getTime();
            const uniqueEmail = `user_${timestamp}@example.com`;
            
            const newTask = await prisma.task.create({
                data: {
                    Project: { connect: { ProjectID: projectId } },
                    TaskName: taskName,
                    Hours: parseFloat(Hours),
                    Employee: {
                        create: {
                            EmployeeID,
                            FirstName: "",
                            Email: uniqueEmail,
                            Password: "",
                            Admin: isManager ? 1 : 0,
                            EmployeeType: "",
                            name: ""
                        }
                    }
                },
            });   
    
            res.json({ status: 'success', message: 'Task created successfully', data: newTask });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
  
    getProjectDetails: async (req, res) => {
      try {
        const { employeeId, startDate, endDate } = req.body;
  
        if (!employeeId || !startDate || !endDate) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
  
        const projectDetails = await prisma.task.findMany({
            where: {
              EmployeeID: employeeId,
              Date: {
                gte: new Date(startDate), 
                lte: new Date(endDate),   
              },
            },
            select: {
              Project: true,
              TaskName: true,
              Hours: true,
            },
          });
  
        const groupedProjects = projectDetails.reduce((acc, task) => {
          const projectId = task.Project.ProjectID;
          if (!acc[projectId]) {
            acc[projectId] = {
              projectId: task.Project.ProjectID,
              projectName: task.Project.ProjectName,
              tasks: [],
            };
          }
          acc[projectId].tasks.push({
            taskName: task.TaskName,
            hours: task.Hours,
          });
          return acc;
        }, {});
  
        const projectArray = Object.values(groupedProjects);  
        res.json({ status: 'success', data: projectArray });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    },
  };
  
  module.exports = taskController;
  