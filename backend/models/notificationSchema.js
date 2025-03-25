const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId,ref : 'User'},
    notifList : [{
        content : {type : String,required : true},
        createdAt : {type : Date, default : Date.now}
    }]
})

module.exports = mongoose.model("Notification",NotificationSchema);