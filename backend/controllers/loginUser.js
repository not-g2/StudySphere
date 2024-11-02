//verifies if a user is logged in and ends the request early if the user isn’t logged in

// verify with frontend as to wheter they are using Bearer Token Authentication
// if they are using that , then we will do the token authentication in the following way :
// const token = req.headers.authorization?.split(' ')[1]; 


const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (username,password) => {
    try{

        // find the user
        const user = await User.findOne({ username });

        // if user is not found , return an error
        if(!user){
            return {error : "user not found"};
        }

        // compare the hashed password and the given password
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return {error : "incorrect password"};
        }

        // password matches
        const token = jwt.sign(
            { id : user._id , username : user.username}, //Payload (user data to include in the token)
            process.env.JWT_SECRET, //Secret key (used to sign the token)
            {expiresIn:'1h'} // additional configurations

        )
    }catch(error){
        console.log(error);
        return {error : 'Error during login process'}
    }
};

module.exports = {loginUser};