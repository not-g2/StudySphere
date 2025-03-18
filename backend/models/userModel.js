const mongoose = require('mongoose');
// import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    googleId : {
        type : String
    },
    githubId : {
        type : String
    },
    name:{
        type: String
    },
    userName:{
        type : String
    },
    email:{
        type : String, 
        required : true , 
        unique: true,
        lowercase : true
    },
    password:{
        type : String , 
        required : [true,"password is required"]
    },
    academicGoals:[
        {type : mongoose.Schema.Types.ObjectId , ref : 'Goal'}
    ],
    courses : [
        {type : mongoose.Schema.Types.ObjectId , ref : 'Course'}
    ],
    auraPoints : {type : Number , 
        default : 0
    },
    level : {type : Number , 
        default : 1
    },
    achievements : [
        {type : mongoose.Schema.Types.ObjectId , ref : 'Achievement'}
    ],
    rewards: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Reward'}
    ],
    studyGroups: [
        {type: mongoose.Schema.Types.ObjectId , ref : 'Group'}
    ],
    groupCreated : {
        // this denotes the number of groups created by a particular user , so that any user doesnt really make too  any un necessary groups
        type : Number,
        default : 0
    },
    xp : {
        type : Number , 
        default : 0
    },
    image:{
        publicId:{
            type: String,
            //required: true,
        },
        url: {
            type: String,
            //required: true,
        }
    },
    phoneNumber : {
        type : String , 
        minlength :10 , 
        maxlength : 10 
    },
    createdAt : {
        type : Date , 
        default : Date.now()
    },
    // Attendance tracking
    attendance: [
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
            date: { type: Date, required: true },
            status: { type: String, enum: ['present', 'absent'], default: 'absent' }
        }
    ]
});

module.exports = mongoose.model('User', UserSchema);
// export const User = mongoose.model("User",UserSchema);