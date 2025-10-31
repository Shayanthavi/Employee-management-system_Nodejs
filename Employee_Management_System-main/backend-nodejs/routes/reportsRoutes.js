const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.get('/reports', authenticateToken, reportsController.getReports);
router.get('/reports/employee/:id', authenticateToken, reportsController.getEmployeeReport);
router.get('/reports/calendar', authenticateToken, reportsController.getAttendanceCalendar);

module.exports = router;
