const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   name:{
    type: String,
    require:[true, 'name is required']
   },
   email:{
    type:String,
    require:[true, 'email is required']
   },
   password:{
    type:String,
    require:[true, 'password is required']
   },
   isAdmin:{
      type:Boolean,
      default:false
   },
   isDoctor:{
      type:Boolean,
      default:false
   },
   notification:{
      type:Array,
      default:[]
   },
   seennotification:{
      type:Array,
      default:[],
   },
})

const userModel = mongoose.model('user', userSchema)
module.exports = userModel;