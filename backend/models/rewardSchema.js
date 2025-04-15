const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
    name : {type : String},
    reqPoints : {type : Number},
    picture : {type : String}
});
module.exports = mongoose.model("Reward", rewardSchema);
