const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name : {type : String , required : true},
    section : {type : String},
    description : {type : String , required : true},
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    //assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
    createdAt: { type: Date, default: Date.now },
    coursePic : {
        publicId:{
            type: String,
            //required: true,
        },
        url: {
            type: String,
            //required: true,
        }
    }
})

module.exports = mongoose.model('Course',CourseSchema);