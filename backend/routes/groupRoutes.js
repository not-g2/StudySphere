const express = require("express");
const router = express.Router();
const { upload } = require("../utils/cloudinary");
const User = require("../models/userModel");
const Group = require("../models/groupSchema");
const authMiddleware = require("../middleware/auth");
//const { Roofing, Room } = require("@mui/icons-material");

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

        const group = await Group.findOne({groupCode : groupid});

        if(!group){
            return res.status(404).json({
                message : "group not found"
            })
        }

        // Check if user is already in the group
        const isAlreadyMember = group.members.some(member => member.user.toString() === userId);
        if (isAlreadyMember) {
            return res.status(400).json({ message: "User is already a member of this group" });
        }

        // Add user to the group's members and update user's studyGroups list
        const updatedGroup = await Group.findOneAndUpdate(
            { groupCode: groupid },
            { $push: { members: { user: userId, rank: "Member" } } },
            { new: true } // Return the updated group
        );

        await User.findByIdAndUpdate(userId, { $push: { studyGroups: updatedGroup._id } });
        return res.status(200).json({
            msg : "user successfully added",
            updatedGroup
        })


    } catch(error){
        console.error(error);
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
})

module.exports = router;