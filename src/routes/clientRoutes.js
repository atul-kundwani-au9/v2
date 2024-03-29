
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');
router.post('/create',authMiddleware.authenticate, clientController.createClient);
router.get('/list',authMiddleware.authenticate, clientController.getClientList);
router.get('/employee-details', authMiddleware.authenticate, clientController.getEmployeeDetails);

module.exports = router;
