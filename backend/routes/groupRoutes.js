const express = require("express");
const router = express.Router();
const { upload } = require("../utils/cloudinary");
const User = require("../models/userModel");
const Group = require("../models/groupSchema");
const authMiddleware = require("../middleware/auth");
const { Roofing, Room } = require("@mui/icons-material");

// create a group
router.post("/create",authMiddleware,async(req,res)=>{
    try{
        const userId = req.user.userID;
        const {name}= req.body;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                message : "user not found"
            })
        }

        if(user.groupCreated>=10){
            return res.status(403).json({
                message : "the user already created the maximum number of groups!"
            })
        }

        const newGroup = new Group({
            name,
            creator : userId,
            members : [{user : userId, rank : "Creator"}]
        })

        await newGroup.save();

        user.groupCreated++;
        await user.save();

        await User.findByIdAndUpdate(userId, { $push: { studyGroups: newGroup._id } });

        res.status(201).json({
            message : "Room created successfully!",
            newGroup
        })
        

    }catch(error){
        console.error(error);
        res.status(500).json({
            message : 'Internal Server Error'
        })
    }
});

// join a group
router.post("/joingroup/:groupid",authMiddleware,async(req,res)=>{
    try{
        const {groupid} = req.params;
        const userId = req.user.userID;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                message : "user not found"
            })
        }

        const room = await Room.findOne({groupCode : groupid});

        if(!room){
            return res.status(404).json({
                message : "room not found"
            })
        }

        await 


    } catch(error){
        console.error(error);
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
})