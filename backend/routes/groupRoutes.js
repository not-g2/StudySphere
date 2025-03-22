const express = require("express");
const crypto = require("crypto");
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

        if(user.groupCreated>10){
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
        if (!groupid) {
            return res.status(400).json({ message: "Group ID is required!" });
        }
        const userId = req.user.userID;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                message : "user not found"
            })
        }

        const group = await Group.findById({_id : groupid});

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
            { _id: groupid },
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
        const {groupid} = req.params;
        if (!groupid) {
            return res.status(400).json({ message: "Group ID is required!" });
        }
        const userId = req.user.userID;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                message : "user not found"
            })
        }

        const group = await Group.findById({groupid : groupid});

        if(!group){
            return res.status(404).json({
                message : "group not found"
            })
        }

        // check if the user is the part of the group
        let isPartOfGroup = false;
        for(const member of group.members){
            if(member.user.toString() === userId.toString()){
                isPartOfGroup = true;break;
            }
        }
        if(!isPartOfGroup){
            return res.status(403).json({
                message : "User is not a part of this group"
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
router.delete("/rmvuser/:groupid/:rmvuserId",authMiddleware,async(req,res)=>{
    try{
        const {groupid,rmvuserId} = req.params;
        if (!groupid) {
            return res.status(400).json({ message: "Group ID is required!" });
        }
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

        const group = await Group.findById({_id : groupid});

        if(!group){
            return res.status(404).json({
                message : "group not found"
            })
        }

        // check if the user is the part of the group
        let isPartOfGroup = false;
        for(const member of group.members){
            if(member.user.toString() === userId.toString()){
                isPartOfGroup = true;break;
            }
        }
        if(!isPartOfGroup){
            return res.status(403).json({
                message : "User is not a part of this group"
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
router.get("/getallusers/:groupid",authMiddleware,async(req,res)=>{
    try{
        const {groupid} = req.params;

        if (!groupid) {
            return res.status(400).json({ 
                message: "Group ID is required!" 
            });
        }

        let group = await Group.findById({_id : groupid});

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

        // check if the user is the part of the group
        let isPartOfGroup = false;
        for(const member of group.members){
            if(member.user.toString() === userId.toString()){
                isPartOfGroup = true;break;
            }
        }
        if(!isPartOfGroup){
            return res.status(403).json({
                message : "User is not a part of this group"
            })
        }

        group = await group.populate("members.user","name");

        let memberInfo = group.members.map((member) => {
            //console.log(member.user.name);
            return {
                memberid : member.user._id,
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
router.post("/changemembership/:groupid/",authMiddleware,async(req,res)=>{
    try{
        const {targetuserId,newRole} = req.body;
        const {groupid} = req.params;
        if (!groupid) {
            return res.status(400).json({ message: "Group ID is required!" });
        }
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

        const group = await Group.findOne({
            _id: groupid,
            $and: [
                { "members.user": userId },
                { "members.user": targetuserId }
            ]
        });
        console.log(group)
        if(!group){
            return res.status(404).json({
                message : "Specified Group doesnt exist!"
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

        if(newRole!=="Member" && newRole!=="Admin"){
            return res.status(400).json({
                message : "Wrong role!"
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
                {_id : group._id},
                {$push : {members : {user : targetuser._id, rank : newRole}}}
            )
        }
        res.status(200).json({ message: "Membership updated successfully!" });

        // else{
        //     res.status(400).json({
        //         message : "Wrong role!"
        //     })
        // }

        
    } catch(error){
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
})

// show all the groups joined by a user
router.get("/allusergrps",authMiddleware,async(req,res)=>{
    try{
        const userid = req.user.userID;

        const user = await User.findById(userid);

        if(!user){
            return res.status(401).json({
                message : "User isnt logged in!"
            })
        }

        await user.populate("studyGroups","name");

        let usergrp=[];

        //console.log(user.studyGroups.length())

        for(const group of user.studyGroups){
            user.push({
                _id : group._id,
                name : group.name
            });
        }

        return res.status(200).json({
            message : "Fetched all groups correctly!",
            usergrp
        })
    } catch(error){
        console.error(error);
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
})

// route to make an announcement in the group
router.post("/createanncmnt/:groupid",authMiddleware,async(req,res)=>{
    try{
        const userid = req.user.userID;
        const {announcementBody}=req.body;
        const {groupid} = req.params;
        if (!groupid) {
            return res.status(400).json({ message: "Group ID is required!" });
        }
        if(!announcementBody){
            return res.status(400).json({ message: "Description for announcement is needed!" });
        }
        const user = await User.findById(userid);

        if(!user){
            return res.status(401).json({
                message : "User isnt logged in"
            })
        }

        const group = await Group.findById({_id : groupid});

        if(!group){
            return res.status(404).json({
                message : "group doesnt exist."
            })
        }

        // check if the user is the part of the group
        let isPartOfGroup = false;
        let rankOfUser = "";
        for(const member of group.members){
            if(member.user.toString() === userid.toString()){
                isPartOfGroup = true;
                rankOfUser = member.rank;
                break;
            }
        }
        if(!isPartOfGroup){
            return res.status(403).json({
                message : "User is not a part of this group"
            })
        }

        if(rankOfUser === 'Member'){
            return res.status(403).json({
                message : "Only Admin/Creator can perform this task!"
            })
        }

        let anncmntObj = {
            announcementId: crypto.randomBytes(4).toString("hex"),
            createdBy : userid,
            content : announcementBody,
        }
        
        group.announcements.push(anncmntObj);

        await group.save();

        return res.status(200).json({
            message : "Announcement successfully created.",
            authorOfAnnouncement : user.name,
            group,
            user
        })



    } catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server error"
        })
    }
})

// fetch all the announcements
router.post("/fetchanncmnt/:groupid",authMiddleware,async(req,res)=>{
    try{
        const {groupid} = req.params;
        if (!groupid) {
            return res.status(400).json({ message: "Group ID is required!" });
        }

        const group = await Group.findById({_id : groupid}).populate("announcements.createdBy", "name");;

        if(!group){
            return res.status(404).json({
                message : "group doesnt exist."
            })
        }


        let allAnnouncements = [];

        for(const anncmnt of group.announcements){
            allAnnouncements.push({
                content : anncmnt.content,
                user : anncmnt.createdBy
            })
        }

        return res.status(200).json({
            message : "All announcements fetched",
            allAnnouncements
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
})

// delete an announcement
router.delete("/deleteanncmnt/:groupid/:anncmntid",authMiddleware,async(req,res)=>{
    try{
        const {groupid,anncmntid} = req.params;

        if (!groupid) {
            return res.status(400).json({ message: "Group ID is required!" });
        }
        if (!anncmntid) {
            return res.status(400).json({ message: "announcement ID is required!" });
        }

        const group = await Group.findOne({
            _id : groupid,
            "announcements.announcementId" : {$all : [anncmntid]}
        });

        if(!group){
            return res.status().json({
                message : 'Group not found'
            })
        }

        const res = await Group.updateOne(
            {_id : group._id},
            {$pull : {announcements : {announcementId : anncmntid}}}
        )

        if(res.modifiedCount === 0){
            return res.status(404).json({ message: "Announcement not found!" });
        }

        return res.status(200).json({ message: "Announcement removed successfully!" });


    } catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
})

// route for a member to leave the group
router.delete("/leavegrp/:groupid/:successoruserid?",authMiddleware,async(req,res)=>{
    try{
        const userid = req.user.userID;
        const {groupid,successoruserid} = req.params;

        const user = await User.findById(userid);
        if(!user ){
            return res.status(404).json({
                message : "user not found"
            })
        }
        
        const group = await Group.findOne({
            _id : groupid,
            "members.user" : userid
        });
        if(!group){
            return res.status(404).json({
                message : "group doesnt exist."
            })
        }

        // check if the user is the part of the group
        let isPartOfGroup = false;
        for(const member of group.members){
            if(member.user.toString() === userid.toString()){
                isPartOfGroup = true;break;
            }
        }
        if(!isPartOfGroup){
            return res.status(403).json({
                message : "User is not a part of this group"
            })
        }

        // some cases to take care of :
        // 1. If creator leaves , then he can make any member of his choice as the creator .

        // 2. If there are no other members in the group , then this is as good as just deleting the group

        // in either of the case , we will have to remove this study group from the list of the groups the user is currently joined in.

        // remove the group from the user db
        await User.updateOne(
            {_id : userid},
            {$pull : {studyGroups : group._id}}
        )

        // check number of members in the group
        let numberOfMembers = group.members.length;
        if(numberOfMembers===1){
            // delete the group from the db
            user.groupCreated--;
            await user.save();
            await Group.findByIdAndDelete(group._id);

            return res.status(200).json({
                message : "Since there is only one user , the entire group has been deleted"
            })
        }

        if(group.creator.toString() === userid.toString()){
            // this means that the creator of the group is leaving the group

            if(!successoruserid){
                return res.status(400).json({
                    message : "A successor user need to be specified!"
                })
            }
            const successoruser = await User.findById(successoruserid);
            if(!successoruser ){
                return res.status(404).json({
                    message : "successor user not found"
                })
            }
            user.groupCreated--;
            await user.save();

            successoruser.groupCreated++;
            await successoruser.save();

            group.creator = successoruserid;
            await group.save();

            await Group.updateOne(
                {_id : group._id},
                {$pull : {members : {user : user._id}}}
            )

            // MongoDB field names containing a dot (.) must be enclosed in quotes in JavaScript.
            await Group.updateOne(
                {_id : group._id , "members.user" : successoruserid},
                {$set : {"members.$.rank" : "Creator"}}
            )
            return res.status(200).json({
                message : "Creator of the group removed , new creator reinstantiated"
            })
        }

        // if we reach here , it means that the user is of "member" rank in a group with multiple users
        await Group.updateOne(
            {_id : group._id},
            {$pull : {members : {user : user._id}}}
        )

        return res.status(200).json({
            message : "User is successfully removed!"
        })

    } catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
})

router.get("/getstatus/:groupid/:targetuserid",async(req,res)=>{
    try{
        const {groupid,targetuserid} = req.params;

        if(!groupid || !targetuserid) {
            return res.status(400).json({
                message : "Missing required parameters"
            })
        }

        const group = await Group.findOne(
            {_id : groupid,"members.user" : targetuserid},
            {"members.$" : 1}
        )

        if(!group || !group.members.length){
            return res.status(404).json({
                message : "user not found in group"
            })
        }

        return res.status(200).json({
            rankOfUser : group.members[0].rank
        })


    } catch(error){
        console.error(error);
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
})

// route to upload a file
router.post("/uploadfile")


// route to fetch all files

// route to update a file

// route to delete a file
module.exports = router;