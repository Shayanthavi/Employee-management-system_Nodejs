const Attendance = require('../models/Attendance');

// Create attendance record
exports.createAttendance = async (req, res) => {
  try {
    const { employeeName, date, status } = req.body;

    const attendance = await Attendance.create({
      employeeName,
      date,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Attendance created successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Create attendance error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating attendance'
    });
  }
};

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.findAll({
      order: [['date', 'DESC']]
    });

    res.json({
      success: true,
      message: 'Operation successful',
      data: records
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error fetching attendance'
    });
  }
};

// Get attendance by ID
exports.getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByPk(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found'
      });
    }

    res.json({
      success: true,
      message: 'Operation successful',
      data: attendance
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error fetching attendance'
    });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeName, date, status } = req.body;

    const attendance = await Attendance.findByPk(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found'
      });
    }

    await attendance.update({
      employeeName: employeeName || attendance.employeeName,
      date: date || attendance.date,
      status: status || attendance.status
    });

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating attendance'
    });
  }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByPk(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found'
      });
    }

    await attendance.destroy();

    res.json({
      success: true,
      message: 'Attendance deleted successfully'
    });
  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error deleting attendance'
    });
  }
};
