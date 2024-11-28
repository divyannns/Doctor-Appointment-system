const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId:{
        type: String,
        require: true
    },
    doctorId:{
        type: String,
        require: true
    },
    doctorInfo:{
        type: String,
        require: true
    },
    userInfo:{
        type: String,
        require: true
    },
    date:{
        type: String,
        require: true
    },
    status:{
        type: String,
        require: true,
        default:'pending'
    },
    time:{
        type: String,
        require: true
    },
},
{ timestamps: true }
)

const appointmentModel = mongoose.model('appointments', appointmentSchema);

module.exports = appointmentModel;