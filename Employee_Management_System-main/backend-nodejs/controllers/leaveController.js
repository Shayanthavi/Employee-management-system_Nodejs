const LeaveRequest = require('../models/LeaveRequest');

// Create leave request
exports.createLeave = async (req, res) => {
  try {
    const { employeeName, startDate, endDate, reason, status } = req.body;

    const leaveRequest = await LeaveRequest.create({
      employeeName,
      startDate,
      endDate,
      reason,
      status: status || 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Leave created successfully',
      data: leaveRequest
    });
  } catch (error) {
    console.error('Create leave error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating leave request'
    });
  }
};

// Get all leave requests
exports.getAllLeave = async (req, res) => {
  try {
    const records = await LeaveRequest.findAll({
      order: [['startDate', 'DESC']]
    });

    res.json({
      success: true,
      message: 'Operation successful',
      data: records
    });
  } catch (error) {
    console.error('Get leave error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error fetching leave requests'
    });
  }
};

// Get leave by ID
exports.getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveRequest = await LeaveRequest.findByPk(id);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found'
      });
    }

    res.json({
      success: true,
      message: 'Operation successful',
      data: leaveRequest
    });
  } catch (error) {
    console.error('Get leave error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error fetching leave request'
    });
  }
};

// Update leave request
exports.updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeName, startDate, endDate, reason, status } = req.body;

    const leaveRequest = await LeaveRequest.findByPk(id);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found'
      });
    }

    await leaveRequest.update({
      employeeName: employeeName || leaveRequest.employeeName,
      startDate: startDate || leaveRequest.startDate,
      endDate: endDate || leaveRequest.endDate,
      reason: reason || leaveRequest.reason,
      status: status || leaveRequest.status
    });

    res.json({
      success: true,
      message: 'Leave updated successfully',
      data: leaveRequest
    });
  } catch (error) {
    console.error('Update leave error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating leave request'
    });
  }
};

// Delete leave request
exports.deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveRequest = await LeaveRequest.findByPk(id);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found'
      });
    }

    await leaveRequest.destroy();

    res.json({
      success: true,
      message: 'Leave deleted successfully'
    });
  } catch (error) {
    console.error('Delete leave error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error deleting leave request'
    });
  }
};
