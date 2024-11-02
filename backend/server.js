require("dotenv").config();
const express = require('express');
const cors = require('cors');//we need cors to handle any Cross-Origin Resource Sharing errors we may come across
const connectDB = require('../backend/config/db')


connectDB();
const app = express();
app.use(cors()); 
app.use(express.json());

// we can define the middleware





app.listen(8000,()=>{
    console.log("server is running on port 8000");
})
