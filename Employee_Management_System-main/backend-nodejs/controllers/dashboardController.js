const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const { Op } = require('sequelize');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    // Get total employees
    const totalEmployees = await Employee.count();

    // Get total attendance records
    const totalAttendance = await Attendance.count();

    // Get today's attendance
    const todaysAttendance = await Attendance.count({
      where: {
        date: today
      }
    });

    // Get total leave requests
    const totalLeaves = await LeaveRequest.count();

    // Get pending leave requests
    const pendingLeaves = await LeaveRequest.count({
      where: {
        status: 'Pending'
      }
    });

    // Get recent attendance (last 5)
    const recentAttendance = await Attendance.findAll({
      order: [['date', 'DESC']],
      limit: 5
    });

    // Get recent leave requests (last 5)
    const recentLeaves = await LeaveRequest.findAll({
      order: [['startDate', 'DESC']],
      limit: 5
    });

    // Get employees on leave today
    const employeesOnLeaveToday = await LeaveRequest.findAll({
      where: {
        startDate: {
          [Op.lte]: today
        },
        endDate: {
          [Op.gte]: today
        },
        status: {
          [Op.ne]: 'Rejected'
        }
      }
    });

    // Get attendance trend for last 14 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const attendanceTrend = await Attendance.findAll({
      where: {
        date: {
          [Op.gte]: fourteenDaysAgo.toISOString().slice(0, 10)
        }
      },
      order: [['date', 'ASC']]
    });

    res.json({
      success: true,
      message: 'Dashboard statistics fetched successfully',
      data: {
        summary: {
          totalEmployees,
          activeEmployees: totalEmployees, // Can be enhanced with actual active status
          todaysAttendance,
          totalLeaves,
          pendingLeaves
        },
        recentAttendance,
        recentLeaves,
        employeesOnLeaveToday,
        attendanceTrend
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error fetching dashboard statistics'
    });
  }
};

// Get quick summary (lightweight endpoint)
exports.getQuickSummary = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [totalEmployees, todaysAttendance, pendingLeaves] = await Promise.all([
      Employee.count(),
      Attendance.count({ where: { date: today } }),
      LeaveRequest.count({ where: { status: 'Pending' } })
    ]);

    res.json({
      success: true,
      data: {
        totalEmployees,
        todaysAttendance,
        pendingLeaves
      }
    });
  } catch (error) {
    console.error('Get quick summary error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error fetching summary'
    });
  }
};

module.exports = exports;
