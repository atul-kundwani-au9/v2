
// const employeeModel = require('../models/employeeModel');

// const registerEmployee = async (req, res) => {
//   try {
//     const { FirstName, LastName, Email } = req.body;
//     const employee = await employeeModel.createEmployee({
//       FirstName,
//       LastName,
//       Email,
//     });
//     res.json(employee);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// const getEmployeeList = async (req, res) => {
//   try {
//     const employees = await employeeModel.getEmployees();
//     res.json(employees);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// module.exports = {
//   registerEmployee,
//   getEmployeeList,
// };



const employeeModel = require('../models/employeeModel');

const registerEmployee = async (req, res) => {
  try {
    const { FirstName, LastName, Email, Password, Admin, EmployeeType } = req.body;
    const employee = await employeeModel.createEmployee({
      FirstName,
      LastName,
      Email,
      Password,
      Admin,
      EmployeeType,
    });
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getEmployeeList = async (req, res) => {
  try {
    const employees = await employeeModel.getEmployees();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  registerEmployee,
  getEmployeeList,
};
