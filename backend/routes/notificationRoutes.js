const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Notification = require("../models/notificationSchema");

// delete a notification
router.delete("/deletenotification/:userid/:notifid",authMiddleware,async(req,res)=>{
    try{
        const {userid,notifid} = req.params;

        const notification = await Notification.findOneAndUpdate(
            {user : userid , "notifList._id" : notifid},
            {$pull : {notifList : {_id : notifid}}},
            {new : true}
        )

        if(!notification){
            return res.status(404).json({
                message : "no notification found with the given userid and notifid"
            })
        }

        return res.status(200).json({
            message : "notification successfully deleted!"
        })


    } catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
});

// delete all notifications for a user
router.delete("/deleteallnotifications/:userid",authMiddleware,async(req,res)=>{
    try{
        const {userid} = req.params;

        const notification = await Notification.updateOne(
            {user : userid},
            {$set : {notifList : []}}
        )
        
        if(!notification){
            return res.status(404).json({
                message : "user not found"
            })
        }

        return res.status(200).json({
            message : "All notifications successfully deleted!"
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
});

// route to get all notifications
router.get("/getallnotifications/:userid",authMiddleware,async(req,res)=>{
    try{
        const {userid} = req.params;
        
        const notification = await Notification.findOne({
            user : userid
        });

        if(!notification){
            return res.status(404).json({
                message : "no notifs available for the given user"
            })
        }

        const allNotifs = notification.notifList;
        return res.status(200).json({
            message : "Fetched all notifications successfully!",
            allNotifs
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
});
module.exports = router;