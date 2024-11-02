const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{type: String , required : true},
    userName:{type : String, required : true},
    email:{type : String, required : true , unique: true,match: [/.+\@.+\..+/, 'Please fill a valid email address']},
    password:{type : String , required : true},
    academicGoals:[{type : mongoose.Schema.Types.ObjectId , ref : 'Goal'}],
    courses : [{type : mongoose.Schema.Types.ObjectId , ref : 'Course'}],
    auraPoints : {type : Number , default : 0},
    level : {type : Number , default : 1},
    achievements : [{type : mongoose.Schema.Types.ObjectId , ref : 'Achievement'}],
    rewards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reward'}],
    studyGroups: [{type: mongoose.Schema.Types.ObjectId , ref : 'StudyGroup'}],
    xp : {type : Number , default : 0},
    image:{
        publicId:{
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    phoneNumber : {type : String , minlength :10 , maxlength : 10 , match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']},
    createdAt : {type : Date , default : Date.now}
});

module.exports = mongoose.model('User', UserSchema);