


// const employeeModel = require('../models/employeeModel');

// const registerEmployee = async (req, res) => {
//   try {
//     const { FirstName, LastName, Email, Password, Admin, EmployeeType } = req.body;
//     const employee = await employeeModel.createEmployee({
//       FirstName,
//       LastName,
//       Email,
//       Password,
//       Admin,
//       EmployeeType,
//     });
//     res.json(employee);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// const loginEmployee = async (req, res) => {
//   try {
//     const { Email, Password } = req.body;

//     // Find the user by email
//     const employee = await employeeModel.getEmployeeByEmail(Email);

//     // Check if the user exists and verify the password
//     if (!employee || !(await bcrypt.compare(Password, employee.Password))) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     res.json({ message: 'Login successful', employee });
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
//   loginEmployee
// };


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const employeeModel = require('../models/employeeModel');
const { secretKey } = require('../config/config');
// const { generateToken, verifyToken } = require('./jwt');
const registerEmployee = async (req, res) => {
  try {
   
    const { FirstName, LastName, Email, Password, Admin, EmployeeType } = req.body;    
    
    const hashedPassword = await bcrypt.hash(Password, 10);
    
    const employee = await employeeModel.createEmployee({
      FirstName,
      LastName,
      Email,
      Password: hashedPassword,
      Admin,
      EmployeeType,
    });
    
    
    res.json({ employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const loginEmployee = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    
    const employee = await employeeModel.getEmployeeByEmail(Email);
   
    if (!employee || !(await bcrypt.compare(Password, employee.Password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
   
    const token = generateToken({ id: employee.EmployeeID, email: employee.Email });

    res.json({ employee, token });
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


function generateToken(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

module.exports = {
  registerEmployee,
  loginEmployee,
  getEmployeeList,
};
