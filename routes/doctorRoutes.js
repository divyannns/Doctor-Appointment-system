const express = require('express');
const authMiddleWare = require('../middlewares/authMiddleware');
const { getDoctorInfoController, updateProfileController, getDoctorByIdController,  
    doctorAppointmentsController,
    appointmentStatusController} = require('../controllers/doctorCtrl');

const router = express.Router();

// post single doctors info
router.post('/getDoctorInfo', authMiddleWare, getDoctorInfoController )

// post Update profile
router.post('/updateProfile', authMiddleWare, updateProfileController)

// post get single doc
router.post('/getDoctorById', authMiddleWare, getDoctorByIdController)

// get Appointments
router.get('/doctor-appointments', authMiddleWare, doctorAppointmentsController)

// post udateStatus
router.post('/appointment-status', authMiddleWare, appointmentStatusController)

module.exports = router;