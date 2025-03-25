// array of students which are a part of the group
// rank of each user (creater of the group , admin of the group and member of the group)
// upload files , annoucements
// ensure that a student cant create more than 10 groups

const mongoose = require("mongoose");
const crypto = require("crypto");

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
    bannedUsers : [{
        user : {type : mongoose.Schema.Types.ObjectId,ref : 'User'},
        bannedUntil : {type : Date }
    }],
    files :[{
        fileLink : {type : String},
        postedBy : {type : mongoose.Schema.Types.ObjectId,ref : 'User'},
        createdAt : {type : Date, default : Date.now()},
        title : {type : String},
        description : {type : String}
    }],
    announcements : [{
        createdBy : {type : mongoose.Schema.Types.ObjectId,ref : 'User'},
        content : {type : String},
        announcementId : {type : String},
        date : {type : Date , default : Date.now()}
    }],
    groupCode : {type:String,unique:true},
    groupPfp : {type : String}
})

// this middleware is fine , but problem is that whenever any object in Group is saved using .save() , then this middleware will go through all the objects in group to check for announcements with no announcement id , which is expensive , so we will dynamically give
// GroupSchema.pre("save", function (next) {
//     if (!this.groupCode) {
//         const hashInput = `${this._id}${this.createdAt}`;
//         const hash = crypto.createHash("sha256").update(hashInput).digest("hex");
//         this.groupCode = hash.slice(0, 8);
//     }

//     this.announcements.forEach((announcement) => {
//         if (!announcement.announcementId) {
//             const hashInput = `${this._id}${Date.now()}`;
//             const hash = crypto.createHash("sha256").update(hashInput).digest("hex");
//             announcement.announcementId = hash.slice(0, 8);
//         }
//     });

//     next();
// });

GroupSchema.pre("save", function (next) {
    if (this.isNew && !this.groupCode) {  
        const hashInput = `${new mongoose.Types.ObjectId()}${Date.now()}`;
        const hash = crypto.createHash("sha256").update(hashInput).digest("hex");
        this.groupCode = hash.slice(0, 8);
    }

    this.announcements.forEach((announcement) => {
        if (!announcement.announcementId) {
            const hashInput = `${new mongoose.Types.ObjectId()}${Date.now()}`;
            const hash = crypto.createHash("sha256").update(hashInput).digest("hex");
            announcement.announcementId = hash.slice(0, 8);
        }
    });

    next();
});



module.exports = mongoose.model('Group',GroupSchema);