// array of students which are a part of the group
// rank of each user (creater of the group , admin of the group and member of the group)
// upload files , annoucements
// ensure that a student cant create more than 10 groups

const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    //groupId : 
    name : {
        type: String,
        required : true
    },
    creator: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    members: [{
        user : {type:mongoose.Schema.Types.ObjectId,ref:"User"},
        rank : {type: String, enum : ["Creator","Admin","Member"]}
    }],
    file:[{type : String}],
    announcement : [{type : String}]
})

module.exports = mongoose.model('Group',GroupSchema);