const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    title : {type : String, required : true},
    description : {type : String},
    user : {type : mongoose.Schema.Types.ObjectId , ref : 'User'},
    dueDate : {type : Date , required : true},
    status : {type : String , enum : ['pending','completed'] , default : 'pending'}
});

module.exports = mongoose.model('Goal', GoalSchema);