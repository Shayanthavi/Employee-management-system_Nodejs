const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const Department = require('../models/Department');
const { Op } = require('sequelize');

// Get comprehensive reports data
exports.getReports = async (req, res) => {
  try {
    const { startDate, endDate, employeeId, departmentId } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          [Op.between]: [startDate, endDate]
        }
      };
    }

    // Get all employees with filters
    let employeeFilter = {};
    if (employeeId) {
      employeeFilter.id = employeeId;
    }
    if (departmentId) {
      employeeFilter.department = departmentId;
    }

    const employees = await Employee.findAll({
      where: employeeFilter,
      order: [['name', 'ASC']]
    });

    // Get attendance records
    const attendance = await Attendance.findAll({
      where: dateFilter,
      order: [['date', 'DESC']]
    });

    // Get leave requests
    const leaves = await LeaveRequest.findAll({
      order: [['startDate', 'DESC']]
    });

    // Get departments
    const departments = await Department.findAll({
      order: [['name', 'ASC']]
    });

    // Calculate statistics
    const totalEmployees = employees.length;
    const totalDepartments = departments.length;
    
    // Present/Absent today
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today);
    const presentToday = todayAttendance.filter(a => a.status === 'Present').length;
    const absentToday = totalEmployees - presentToday;

    // Leave statistics
    const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
    const approvedLeaves = leaves.filter(l => l.status === 'Approved').length;
    const rejectedLeaves = leaves.filter(l => l.status === 'Rejected').length;

    // Department-wise employee count
    const departmentStats = {};
    employees.forEach(emp => {
      if (emp.department) {
        departmentStats[emp.department] = (departmentStats[emp.department] || 0) + 1;
      }
    });

    // Monthly attendance summary
    const monthlyAttendance = {};
    attendance.forEach(record => {
      const month = record.date.substring(0, 7); // YYYY-MM
      if (!monthlyAttendance[month]) {
        monthlyAttendance[month] = { present: 0, absent: 0, leave: 0 };
      }
      if (record.status === 'Present') {
        monthlyAttendance[month].present++;
      } else if (record.status === 'Absent') {
        monthlyAttendance[month].absent++;
      } else if (record.status === 'Leave') {
        monthlyAttendance[month].leave++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalEmployees,
          totalDepartments,
          presentToday,
          absentToday,
          pendingLeaves,
          approvedLeaves,
          rejectedLeaves
        },
        employees,
        attendance,
        leaves,
        departments,
        departmentStats,
        monthlyAttendance
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching reports'
    });
  }
};

// Get employee-specific report
exports.getEmployeeReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Build date filter
    let dateFilter = { employeeName: employee.name };
    if (startDate && endDate) {
      dateFilter.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    // Get attendance records for this employee
    const attendance = await Attendance.findAll({
      where: dateFilter,
      order: [['date', 'DESC']]
    });

    // Get leave requests for this employee
    const leaves = await LeaveRequest.findAll({
      where: { employeeName: employee.name },
      order: [['startDate', 'DESC']]
    });

    // Calculate statistics
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'Present').length;
    const absentDays = attendance.filter(a => a.status === 'Absent').length;
    const leaveDays = attendance.filter(a => a.status === 'Leave').length;
    const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    const totalLeaves = leaves.length;
    const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
    const approvedLeaves = leaves.filter(l => l.status === 'Approved').length;
    const rejectedLeaves = leaves.filter(l => l.status === 'Rejected').length;

    res.status(200).json({
      success: true,
      data: {
        employee,
        attendance,
        leaves,
        statistics: {
          totalDays,
          presentDays,
          absentDays,
          leaveDays,
          attendanceRate,
          totalLeaves,
          pendingLeaves,
          approvedLeaves,
          rejectedLeaves
        }
      }
    });
  } catch (error) {
    console.error('Get employee report error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching employee report'
    });
  }
};

// Get attendance calendar data
exports.getAttendanceCalendar = async (req, res) => {
  try {
    const { month, year, employeeId } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Month and year are required'
      });
    }

    // Get attendance for the specified month
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = `${year}-${month.padStart(2, '0')}-31`;

    // Build where clause
    let whereClause = {
      date: {
        [Op.between]: [startDate, endDate]
      }
    };

    // Filter by employee if employeeId is provided
    if (employeeId) {
      const employee = await Employee.findByPk(employeeId);
      if (employee) {
        whereClause.employeeName = employee.name;
      }
    }

    const attendance = await Attendance.findAll({
      where: whereClause,
      order: [['date', 'ASC']]
    });

    // Group by date
    const calendarData = {};
    attendance.forEach(record => {
      const date = record.date;
      if (!calendarData[date]) {
        calendarData[date] = {
          present: 0,
          absent: 0,
          leave: 0,
          total: 0
        };
      }
      calendarData[date].total++;
      if (record.status === 'Present') {
        calendarData[date].present++;
      } else if (record.status === 'Absent') {
        calendarData[date].absent++;
      } else if (record.status === 'Leave') {
        calendarData[date].leave++;
      }
    });

    res.status(200).json({
      success: true,
      data: calendarData
    });
  } catch (error) {
    console.error('Get attendance calendar error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching attendance calendar'
    });
  }
};


