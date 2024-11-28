const userModel = require('../models/userModels')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const doctorModel = require('../models/doctorModels')
const appointmentModel = require('../models/appointmentModel')
const moment = require('moment')

// resgister callback
const registerController = async (req,res) => {
   try {
    // for existing user
     const exisitingUser = await userModel.findOne({email:req.body.email})
     if(exisitingUser){
        return res.status(200).send({
            message: 'User Already Exist',
            success: false
        })
     } 
     // password encryption
     const password = req.body.password
     const salt = await bcrypt.genSalt(10)
     const hasedpassword = await bcrypt.hash(password, salt)
     req.body.password = hasedpassword
     // for new user
     const newUser = new userModel(req.body)
     await newUser.save()
     res.status(201).send({
        message:'Register Successfully',
        success: true
     })
   } catch (error) {
     console.log(error);
     res.status(500).send({
        success: false,
        message: `Register controller ${error.message}`
     })
     
   }
}
// login callback
const logingController = async (req, res) => {
    try {
        // checking user or not
        const user = await userModel.findOne({email:req.body.email})
        if(!user){
            return res.status(200).send({
                message:'User not found',
                success: false
            })
        }
        // matching password
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if(!isMatch){
            return res.status(200).send({
                message: 'Invalid Email or Password',
                success: false
            })
        }
        //using jwt
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:'1d',})
        res.status(200).send({
            message:'Login successfully',
            success: true,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: `Error in Login CTRL ${error.message}`
        })
    }
}

// authController for homepage
const authController = async (req, res) => {
    try {
        const user = await userModel.findById({_id:req.body.userId})
        user.password = undefined;
        if(!user){
            return res.status(200).send({
                message:"user not found",
                success:false
            })
        }else{
            res.status(200).send({
                success: true,
                data:user
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:'auth error',
            success: false,
            error
        })
    }
};

// Apply doctor
const applyDoctorController = async(req, res) => {
    try {
        const newDoctor = await doctorModel({...req.body,status:'pending'})
        await newDoctor.save();
        const adminUser = await userModel.findOne({isAdmin:true})
        const notification = adminUser.notification
        notification.push({
            type: 'apply-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
            data:{
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: '/admin/doctors'
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id, {notification})
        res.status(201).send({
            success:true,
            message:'Docotor Account Applied Successfully'
        })
    } catch (error) {
        console.log(error);
        res.send(500).send({
            success:false,
            error,
            message:'Error While Applying For Doctor'
        });  
    }
}

//notification controller

const getAllNotificationController = async (req, res) => {
    try {
        const user = await userModel.findOne({_id:req.body.userId})
        const seennotification = user.seennotification
        const notification = user.notification
        seennotification.push(...notification)
        user.notification = []
        user.seennotification = notification
        const updatedUser = await user.save()
        res.status(200).send({
            success:true,
            message:'All notifiaction marked as seen',
            data: updatedUser,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:'Error in notification',
            success: false,
            error
        })
    }  
}

// delete notification
 const deleteAllNotificationController = async(req, res) => {
   try {
    const user = await userModel.findOne({_id:req.body.userId})
    user.notification =[]
    user.seennotification = []
    const updatedUser = await user.save();
    updatedUser.password = undefined
    res.status(200).send({
        success:true,
        message:'Notification deleted successfully',
        data: updatedUser,
    })
   } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'unable to delete all notification',
        error
    })
   }
 }

 // get All doc 
 const getAllDoctorController = async(req, res) => {
    try {
        const doctors = await doctorModel.find({status:'approved'})
        res.status(200).send({
            success:true,
            message:'Doctor Lists fetch Successfully',
            data:doctors
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'error while fetching doctor'
        })
        
    }
 }

 // book appointment

 const bookAppointmentController = async(req, res) => {
    try {
        req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString()
        req.body.time = moment(req.body.time, 'HH:mm').toISOString();
        req.body.status ='pending'
        const newAppointment = new appointmentModel(req.body)
        await newAppointment.save()
        const user = await userModel.findOne({_id: req.body.doctorInfo.userId})
        user.notification.push({
            type: "New-appointment-request",
            message: `A new Appointment Request from ${req.body.userInfo.name}`,
            onCLickPath: "/user/appointments",
        })
        await user.save();
        res.status(200).send({
          success: true,
          message: "Appointment Book succesfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error while Booking Appointment'
        })
    }
 }

 //bookingAvailbilityController 

 const bookingAvailbilityController = async(req, res) => {
    try {
        const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString();
        const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString();
        const doctorId = req.body.doctorId
        const appointment = await appointmentModel.find({doctorId, 
            date,
            time:{
                $gte:fromTime, $lte: toTime
            }
        })
        if(appointment.length >0){
            return res.status(200).send({
                message:'Appointment not Available at this time',
                success:true
            })
        }else{
            return res.status(200).send({
                success:true,
                message:'Appointments Available'
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error In Booking'
        })
       

    }
 } 

 //userAppointmentController

 const userAppointmentController = async(req, res) => {
    try {
        const appointments = await appointmentModel.find({userId:req.body.userId})
        res.status(200).send({
            success:true,
            message:'User Appointments Fetch Successfully',
            data:appointments
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error In User Appointments'
        })
        
    }
 }

module.exports = {logingController, registerController, authController, applyDoctorController,
     getAllNotificationController, deleteAllNotificationController, getAllDoctorController,
      bookAppointmentController, bookingAvailbilityController, userAppointmentController}