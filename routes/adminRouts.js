 const express = require('express');
 const authMiddleware = require('../middlewares/authMiddleware');
 const { getAllusersController, getAllDoctorController, changeAccountStatusController } = require('../controllers/adminCtrl');

 const router = express.Router()

 // Get method || get users
 router.get('/getAllusers', authMiddleware, getAllusersController);

 // get method || get doctor

 router.get('/getAllDoctors', authMiddleware, getAllDoctorController);

 //post Account status
  router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController)
 module.exports = router