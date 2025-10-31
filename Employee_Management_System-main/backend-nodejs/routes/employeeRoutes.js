const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Employee routes
router.post('/employee', employeeController.createEmployee);
router.get('/employees', employeeController.getAllEmployees);
router.get('/employee/:id', employeeController.getEmployeeById);
router.patch('/employee/:id', employeeController.updateEmployee);
router.delete('/employee/:id', employeeController.deleteEmployee);

module.exports = router;
