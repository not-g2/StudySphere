const mongoose = require("mongoose");

const PomodoroSchema = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId , ref : 'User'},
    focusSessionData : [{
        subject : {type : String},
        timeSpent : {type : Number},
        date : {type : Date}, // this is the current date the user focuses on
        // expiry : {type : Date, expiry : '7d'} this will not work because TTL works only on top level fields , not on subdocuments
    }],
    expiry : {type : Date , default : Date.now , expires : '7d'} // if we use Date.now() here , then the DB will not have the date when the document is created , it will rather have the date of when the schema is created
})

module.exports = mongoose.model("Pomodoro",PomodoroSchema);