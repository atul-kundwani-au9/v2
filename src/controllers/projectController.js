
const projectModel = require('../models/projectModel');

const createProject = async (req, res) => {
  try {
    const { ProjectName, ClientID } = req.body;
    const project = await projectModel.createProject({
      ProjectName,
      ClientID,
    });
   
    res.json({ status: 'success', message: 'Project created successfully', data: project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProjectList = async (req, res) => {
  try {
    const projects = await projectModel.getProjects();
    
    
    res.json({ status: 'success', message: 'Projects retrieved successfully', data: projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createProject,
  getProjectList,
};
