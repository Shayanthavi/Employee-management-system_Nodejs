const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Attendance routes
router.post('/attendance', attendanceController.createAttendance);
router.get('/attendance', attendanceController.getAllAttendance);
router.get('/attendance/:id', attendanceController.getAttendanceById);
router.patch('/attendance/:id', attendanceController.updateAttendance);
router.delete('/attendance/:id', attendanceController.deleteAttendance);

module.exports = router;
