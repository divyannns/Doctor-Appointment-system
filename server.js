const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
// mongodb connection
connectDB();

const app = express();

//middleware
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/v1/user', require('./routes/userRoutes'))
app.use('/api/v1/admin', require('./routes/adminRouts'))
app.use('/api/v1/doctor', require('./routes/doctorRoutes'))

// statics file
app.use(express.static(path.join(__dirname, './client/build')))

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// port
const port = process.env.PORT || 8080

// listning port
app.listen(port, () =>{
    console.log(`Server running in ${process.env.NODE_MODE} mode on port ${process.env.PORT}`);
    
})