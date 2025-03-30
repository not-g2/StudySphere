// this is hard coded
const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
    badges: [
        {
            badgeLink : {type : String},
            content : {type : String}, // this is the description to the title
            title : {type : String} // (eg : Plant collector for collecting all plants in PvZ)
        }
    ]
});

module.exports = mongoose.model('Badge',BadgeSchema)