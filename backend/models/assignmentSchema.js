const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'submitted', 'graded'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    profApproval : {type : Boolean , default : false},
    createdBy : {type : mongoose.Schema.Types.ObjectId , ref : 'User'},
    gDriveLink : {type : String}
});

module.exports = mongoose.model('Assignment',AssignmentSchema);