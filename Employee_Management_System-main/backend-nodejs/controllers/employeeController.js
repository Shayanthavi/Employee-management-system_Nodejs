const Employee = require('../models/Employee');

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, phone, department } = req.body;

    const employee = await Employee.create({
      name,
      email,
      phone,
      department
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating employee'
    });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      order: [['id', 'DESC']]
    });

    res.json({
      success: true,
      message: 'Operation successful',
      data: employees
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error fetching employees'
    });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      message: 'Operation successful',
      data: employee
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error fetching employee'
    });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, department } = req.body;

    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await employee.update({
      name: name || employee.name,
      email: email || employee.email,
      phone: phone || employee.phone,
      department: department || employee.department
    });

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating employee'
    });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await employee.destroy();

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error deleting employee'
    });
  }
};
