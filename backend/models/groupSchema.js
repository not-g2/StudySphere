// array of students which are a part of the group
// rank of each user (member , elder , co leader , leader)
// upload files , annoucements
// ensure that a student cant create more than 10 groups

const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    
})