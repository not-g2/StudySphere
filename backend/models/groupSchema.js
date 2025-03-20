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
    announcement : [{type : String}],
    groupCode : {type:String,unique:true}
})

GroupSchema.pre("save", function (next) {
    if (!this.groupCode) {
        // Corrected to courseCode here
        const hashInput = `${this._id}${this.createdAt}`;
        const hash = crypto
            .createHash("sha256")
            .update(hashInput)
            .digest("hex");
        this.groupCode = hash.slice(0, 8); // Take the first 8 characters of the hash
    }
    next(); 
});

module.exports = mongoose.model('Group',GroupSchema);