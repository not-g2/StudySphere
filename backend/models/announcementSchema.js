const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    description : {type : String },
    title : {type : String},
    course : [{type : mongoose.Schema.Types.ObjectId , ref : 'course'}],
    createdAt : {type : Date , default : Date.now},
    admin : [{type : mongoose.Schema.Types.ObjectId , ref : 'Admin'}]
});

module.exports = mongoose.model('Announcement', announcementSchema );