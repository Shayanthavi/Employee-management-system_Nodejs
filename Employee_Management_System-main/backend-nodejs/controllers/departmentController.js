const Department = require('../models/Department');

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      message: 'Operation successful',
      data: departments
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error fetching departments'
    });
  }
};

// Add new department
exports.addDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if department already exists
    const existing = await Department.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Department already exists'
      });
    }

    const department = await Department.create({ name });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });
  } catch (error) {
    console.error('Add department error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error adding department'
    });
  }
};
