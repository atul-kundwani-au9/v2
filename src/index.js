const express = require('express');
const employeeRoutes = require('./routes/employeeRoutes');
const projectRoutes = require('./routes/projectRoutes');
const clientRoutes = require('./routes/clientRoutes');
const timesheetRoutes = require('./routes/timesheetRoutes');
const reportRoutes = require('./routes/reportRoutes');
const managerEmployeeRoutes = require('./routes/managerEmployeeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authMiddleware = require('./middleware/authMiddleware'); 
var cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors())
app.use(express.json());

app.get("/", authMiddleware.authenticate,(req,res) =>{
  res.send("")
} )
// Use routes
app.use('/employee', employeeRoutes);
app.use('/report', reportRoutes);
app.use('/project', projectRoutes);
app.use('/client', clientRoutes);
app.use('/timesheet', timesheetRoutes);
app.use('/managerEmployee', managerEmployeeRoutes);
app.use('/task',taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


