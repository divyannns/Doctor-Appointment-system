const appointmentModel = require('../models/appointmentModel');
const doctorModel = require('../models/doctorModels');
const userModel = require('../models/userModels');

const getDoctorInfoController = async (req, res) => {
   try {
      const doctor = await  doctorModel.findOne({userId: req.body.userId})
      res.status(200).send({
        success:true,
        message:'doctor data fetch sucess',
        data: doctor
      })
   } catch (error) {
    console.log(error);
    res.status(500).send({
        success: false,
        error,
        message: 'Error in fetching doctor details'
    })
   }
}

// update doc profile

const updateProfileController = async(req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({userId:req.body.userId}, req.body)
        res.status(200).send({
            success:true,
            message:'Doctor Profile Updated',
            data:doctor
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Doctor Profile Upadte issue',
            error
        })
    }
}
// get single doc

const getDoctorByIdController = async(req, res) => {
    try {
        const doctor = await doctorModel.findOne({_id: req.body.doctorId});
        res.status(200).send({
            success:true,
            message:'Single doc info Fetched',
            data:doctor
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in single doctor info'
        })
    }
}

//doctor-appointments

const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId:req.body.userId })
        const appointments = await appointmentModel.find({ doctorId: doctor._id})
        res.status(200).send({
            success:true,
            message:'Doctor Appointment Fetched',
            data: appointments
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in doc Appointments'
        })        
    }
}

// update appointmentStatusController

const appointmentStatusController = async (req, res) => {
    try {
        const { appointmentsId, status } = req.body;
        const appointments = await appointmentModel.findByIdAndUpdate(
          appointmentsId,
          { status }
        );
        const user = await userModel.findOne({ _id: appointments.userId });
        const notification = user.notification;
        notification.push({
          type: "status-updated",
          message: `your appointment has been updated ${status}`,
          onCLickPath: "/appointment-status",
        });
        await user.save();
        res.status(200).send({
          success: true,
          message: "Appointment Status Updated",
        });

      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error In Update Status",
        });
      }
    };


module.exports = {getDoctorInfoController, updateProfileController, getDoctorByIdController,
    doctorAppointmentsController, appointmentStatusController}