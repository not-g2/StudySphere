const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name : {type : String},
    password : {type : String},
    email : {type : String , unique : true , required : true},
    course : [{type : mongoose.Schema.Types.ObjectId , ref : 'Course'}],
    chapter : [{type : mongoose.Schema.Types.ObjectId , ref : 'Chapter'}],
    chapLink : [{type : String}],
    image:{
        publicId:{
            type: String,
            //required: true,
        },
        url: {
            type: String,
            //required: true,
        }
    }
});

module.exports = mongoose.model('Admin', AdminSchema);
