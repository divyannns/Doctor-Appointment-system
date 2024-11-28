const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Mongodb connected ${mongoose.connection.host}`.bgBlue.white);
        
    } catch (error) {
        console.log(`Mongodb server issue ${error}`.bgRed.white);
        
    }
}
module.exports = connectDB;