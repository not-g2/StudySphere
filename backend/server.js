require("dotenv").config();
const express = require('express');
const cors = require('cors');//we need cors to handle any Cross-Origin Resource Sharing errors we may come across

const uploadPicRoutes = require('./routes/picsRoutes');
const authRoutes = require('./routes/authRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const connectDB = require('./config/db');


connectDB();
const app = express();
app.use(cors()); 
app.use(express.json());

app.use('/api/images',uploadPicRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/desc',userProfileRoutes); // desc is for description
app.use('/api/assgn',assignmentRoutes);
app.use('/api/courses',courseRoutes);

app.listen(8000,()=>{
    console.log("server is running on port 8000");
})
