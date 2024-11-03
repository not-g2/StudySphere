const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
    createdAt: { type: Date, default: Date.now },
    deadLine : {type :  Date , required : true}
})

module.exports = mongoose.model('Chapter',ChapterSchema);