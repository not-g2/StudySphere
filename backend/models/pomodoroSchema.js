const mongoose = require("mongoose");

const PomodoroSchema = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId , ref : 'User'},
    focusSessionData : [{
        subject : {type : String},
        timeSpent : {type : Number},
        date : {type : Date}, // this is the current date the user focuses on
        // expiry : {type : Date, expiry : '7d'} this will not work because TTL works only on top level fields , not on subdocuments
    }],
    expiry: { type: Date, default: () => new Date(), expires: '7d' }
})

module.exports = mongoose.model("Pomodoro",PomodoroSchema);