const express = require("express");
const router = express.Router();
const { upload } = require("../utils/cloudinary");
const User = require("../models/userModel");
const Group = require("../models/groupSchema");
const authMiddleware = require("../middleware/auth");
require('dotenv').config();

// create a group (works , checked on postman)
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
            message : "group created successfully!",
            newGroup
        })
        

    }catch(error){
        console.error(error);
        res.status(500).json({
            message : 'Internal Server Error'
        })
    }
});

// join a group (works , tested on postman)
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

        // check if user is in cooldown period before joining a group
        for(const member of group.bannedUsers){
            if(member.user.toString() === userId.toString()){
                const currDate = Date.now();
                if(currDate < member.bannedUntil){
                    return res.status(403).json({
                        message : "user cannot join group , as he was removed recently . Try after 1 week from getting removed!"
                    })
                }

                else{
                    break;
                }
            }
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

// delete a group
router.delete("/delgroup/:groupid",authMiddleware,async(req,res)=>{
    try{
        // groupId is the group code
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

        // only owner can delete a group
        if (group.creator.toString() !== userId) {
            return res.status(403).json({ message: "Only the creator can delete the group" });
        }

        // to delete the group :- 
        // 1. remove the group from the user joined groups (i.e remove all the participants from the group)
        // 2. decrement the number of groups created by the owner
        // 3. delete the group from the Group Database
        
        // removing user from group
        await User.updateMany(
            { studyGroups: group._id },
            { $pull: { studyGroups: group._id } }
        );

        user.groupCreated--;
        await user.save();

        await Group.findByIdAndDelete(group._id);

        return res.status(200).json({
            msg : "group deleted successfully!"
        })


    } catch(error){
        console.log(error);
        res.status(500).json({
            msg : "Internal server error"
        })
    }

})

// removing someone from the group (this works, checked on postman)
router.delete("/rmvuser/:groupId/:rmvuserId",authMiddleware,async(req,res)=>{
    try{
        // groupId is the group code
        const {groupId,rmvuserId} = req.params;
        const userId = req.user.userID;

        const user = await User.findById(userId);
        const rmvuser = await User.findById(rmvuserId);

        if(!user ){
            return res.status(404).json({
                message : "user not found"
            })
        }

        if(!rmvuser){
            return res.status(404).json({
                message : "user to be removed not found"
            })
        }

        const group = await Group.findOne({groupCode : groupId});

        if(!group){
            return res.status(404).json({
                message : "group not found"
            })
        }

        // we have to make sure that the creator of the group isnt removed

        if(rmvuser._id.toString() === group.creator.toString()){
            return res.status(403).json({
                msg : "The creator of the group cannot be removed."
            })
        }
        
        let isCreator = (group.creator.toString() === user._id.toString());
        let isAdmin = false;
        for(const member of group.members){
            if(member.rank === 'Admin' && member.user.toString() === user._id.toString()){
                isAdmin = true;break;
            }
        }

        if(!isCreator && !isAdmin){
            return res.status(403).json({
                msg : "User is not admin/creator , so cant remove other members"
            })
        }

        // now we ensure that the user is not able to join the group until a cooldown period (defined in the env file)

        await Group.updateOne(
            // by default , values from env file are read as a string , so we need to explicitly typecast it to a number
            {_id : group._id},
            {$push : {bannedUsers : {user : rmvuser._id,bannedUntil : new Date(Date.now() + (Number(process.env.COOLDOWN) || 604800000))}}}
        )
        await User.updateOne(
            {_id : rmvuser._id},
            {$pull : {studyGroups : group._id}}
        )

        await Group.updateOne(
            {_id : group._id},
            {$pull : {members : {user : rmvuser._id}}}
        )

        res.status(200).json({
            msg : "User successfully removed from the group!"
        })

    } catch(error){
        console.error(error);
        res.status(500).json({
            msg : "Internal Server Error"
        })
    }
})

// for a group , show all the participants with their membership status (works)
router.get("/getallusers/:groupId",authMiddleware,async(req,res)=>{
    try{
        const {groupId} = req.params;

        if (!groupId) {
            return res.status(400).json({ 
                message: "Group ID is required!" 
            });
        }

        let group = await Group.findOne({groupCode : groupId});

        if(!group){
            return res.status(404).json({
                message : "Group doesnt exist!"
            })
        }

        const userId = req.user.userID;

        const user = await User.findById(userId);
        if(!user){

            return res.status(401).json({
                message : "user not logged in!"
            })
        }

        group = await group.populate("members.user","name");

        let memberInfo = group.members.map((member) => {
            console.log(member.user.name);
            return {
                name : member.user.name,
                rank : member.rank
            }
        })

        return res.status(200).json({
            msg : "Fetched all users!",
            memberInfo
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
})

// change membership status of a member (only the creator of the group can do this)
router.post("/changemembership/:groupId/",authMiddleware,async(req,res)=>{
    try{
        const {targetuserId,newRole} = req.body;
        const {groupId} = req.params;
        const userId = req.user.userID;

        const user = await User.findById(userId);
        
        if(!user){
            return res.status(401).json({
                message : "user not found!"
            })
        }

        const targetuser = await User.findById(targetuserId);
        if(!targetuser){
            return res.status(401).json({
                message : "user whoose membership status is to be changed not found!"
            })
        }

        const group = await group.findOne({groupCode : groupId});

        if(!group){
            return res.status(404).json({
                message : "Group doesnt exist!"
            })
        }

        if(group.creator.toString() !== userId.toString()){
            return res.status(403).json({
                message : "Only the creator is allowed to perform this operation!"
            })
        }

        if(group.creator.toString() === targetuser._id.toString()){
            return res.status(403).json({
                message : "Membership status of the creator cannot be changed!"
            })
        }

        await Group.updateOne(
            {_id : group._id},
            {$pull : {members : {user : targetuser._id}}}
        )

        if(newRole==='Member'){
            await Group.updateOne(
                {_id : group._id},
                {$push : {members : {user : targetuser._id, rank : newRole}}}
            )
        }
        else if(newRole==='Admin'){
            await Group.updateOne(
                {id : group._id},
                {$push : {members : {user : targetuser._id, rank : newRole}}}
            )
        }
        else{
            res.status(400).json({
                message : "Wrong role!"
            })
        }

        
    } catch(error){
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
})

// route to upload a file
//router.post()

// show all the groups joined by a user
router.get("/allusergrps", authMiddleware, async (req, res) => {
    try {
      const userid = req.user.userID;
  
      const user = await User.findById(userid);
  
      if (!user) {
        return res.status(401).json({
          message: "User isn't logged in!",
        });
      }
  
      await user.populate("studyGroups", "name");
  
      let usergrp = [];
  
      for (const group of user.studyGroups) {
        usergrp.push({
          _id: group._id,
          name: group.name,
        });
      }
  
      return res.status(200).json({
        message: "Fetched all groups correctly!",
        usergrp,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });
  
module.exports = router;