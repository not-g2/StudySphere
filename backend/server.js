require("dotenv").config();
const express = require('express');
const cors = require('cors');//we need cors to handle any Cross-Origin Resource Sharing errors we may come across

const uploadPicRoutes = require('./routes/picsRoutes');
const connectDB = require('./config/db');


connectDB();
const app = express();
app.use(cors()); 
app.use(express.json());

app.use('/api/images',uploadPicRoutes);





app.listen(8000,()=>{
    console.log("server is running on port 8000");
})
