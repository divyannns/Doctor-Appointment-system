const express = require('express');
const { logingController, registerController, authController,applyDoctorController,getAllNotificationController,
    deleteAllNotificationController, getAllDoctorController, 
    bookAppointmentController,
    bookingAvailbilityController,
    userAppointmentController} = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// routes
// loging post
router.post('/login', logingController)

//register post
router.post('/register', registerController)

// Auth post
router.post('/getUserdata', authMiddleware, authController)

// Apply doctor post

router.post('/apply-doctor', authMiddleware, applyDoctorController)

// Notification doctor post

router.post('/get-all-notification', authMiddleware, getAllNotificationController)

// Notification doctor post

router.post('/delete-all-notification', authMiddleware, deleteAllNotificationController)

// get all doc

router.get('/getAllDoctors', authMiddleware, getAllDoctorController)

// book appointment

router.post('/book-appointment', authMiddleware, bookAppointmentController)

// booking Availbility

router.post('/booking-availbility', authMiddleware, bookingAvailbilityController)

// appointment list

router.get('/user-appointment', authMiddleware, userAppointmentController)

module.exports = router