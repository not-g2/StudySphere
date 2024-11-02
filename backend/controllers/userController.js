const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const registerUser = async (req,res) => {
    const {name , username , password} = req.body;

    try{
        // check if the username is already taken
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({
                message : "Username is already taken!"
            })
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password,10);

        // Create the user
        const user = await User.create({
            name,
            username,
            password : hashedPassword
        });

        // report successful creation of user in the databsae
        res.status(400).json({
            id : user._id,
            username : user.username
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            message : "Error creating user"
        });
    }
};

module.exports = { registerUser };