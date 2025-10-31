const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

// Leave routes
router.post('/leave', leaveController.createLeave);
router.get('/leave', leaveController.getAllLeave);
router.get('/leave/:id', leaveController.getLeaveById);
router.patch('/leave/:id', leaveController.updateLeave);
router.delete('/leave/:id', leaveController.deleteLeave);

module.exports = router;
