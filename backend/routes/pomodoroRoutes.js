const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Pomodoro = require("../models/pomodoroSchema")
const User = require("../models/userModel");

// route to fetch all subjects in pomodoro (works , tested on postman)
router.get("/fetchalltags/:userid",authMiddleware,async(req,res)=>{
    try{
        const {userid} = req.params;

        const subjects = await Pomodoro.findOne({
            user : userid
        }).select("focusSessionData.subject").lean();

        // use .lean() only when u want to read the result
        // without .lean() , the subjects variable will store the mongodb object , which will have properties like .save() , .populate() etc , which isnt really needed here (makes the query faster)

        if(!subjects){
            return res.status(404).json({
                message : "No valid pomodoro session for user yet"
            })
        }
        const subjectList =  [...new Set(subjects?.focusSessionData.map(item => item.subject))];

        return res.status(200).json({
            message : "all subjects fetched successfully!",
            subjectList
        })


    } catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
})

// route to send the focus session data to the frontend for analytics (works , tested on postman)
router.get("/fetchuseranalytics/:userid",authMiddleware,async(req,res)=>{
    try{
        const {userid} = req.params;

        const focusdata = await Pomodoro.findOne({user : userid}).select("focusSessionData user").populate("user","name").lean();

        if(!focusdata){
            return res.status(404).json({
                message : "No pomodoro data on the specified user"
            })
        }

        return res.status(200).json({
            message : "fetched the data successfully",
            focusdata,
            //userId : userid
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
})

// route for updating focus session data for user (works , tested on postman)
router.post("/insertfocussessiondata/:userid",authMiddleware,async(req,res)=>{
    try{
        const {userid} = req.params;

        const userExists = await User.findById(userid);
        if(!userExists){
            return res.status(404).json({
                message : "User does not exist!"
            })
        }
        const {subject,timespent,date} = req.body;

        if(!subject || !timespent || !date){
            return res.status(400).json({
                message : "Please provide subject , timespent and date"
            })
        }

        const receivedDateObj = new Date(date);
        receivedDateObj.setUTCHours(0,0,0,0); // normalise to UTC midnight (we are doing this to normalise and standardise the dates everywhere)

        const isUserPartOfPomodoro = await Pomodoro.findOne({
            user : userid
        })

        if(!isUserPartOfPomodoro){
            // this is the user's first time trying the pomodoro
            const updatedPomodoro = await Pomodoro.findOneAndUpdate(
                { user: userid }, 
                {$push: { focusSessionData: { 
                    subject : subject,
                    timeSpent: timespent,
                    date: receivedDateObj 
                }}},
                { new: true, upsert: true } // Create if not exists
            );

            return res.status(200).json({
                message : "User recorded in the database!",
                //updatedPomodoro
            })
        }

        const pomodoro = await Pomodoro.find(
            {user : userid,"focusSessionData.subject" : subject}
        )

        if(!pomodoro.length){
            // this is the first time user is doing this subject
            const updatedPomodoro = await Pomodoro.findOneAndUpdate(
                {user : userid },
                {$push : {focusSessionData : {
                    subject : subject,
                    timeSpent : timespent,
                    date : receivedDateObj
                }}},
                {new : true}
            )

            return res.status(200).json({
                message : "User data successfully added!",
                updatedPomodoro
            })
        }

        // if we are here , means that we already have some entries for a given subject for this user
        let existingSession = null;
        for(const doc of pomodoro){
            existingSession = doc.focusSessionData.find(session => session.subject === subject && new Date(session.date).getTime() === receivedDateObj.getTime());

            if(existingSession){
                break;
            }
        }
        
        if(existingSession){
            const updatedPomodoro = await Pomodoro.findOneAndUpdate(
                { user: userid, focusSessionData: { $elemMatch: { subject: subject, date: receivedDateObj } } },
                {$inc : {"focusSessionData.$.timeSpent" : timespent}},
                {new : true}
            )

            return res.status(200).json({
                message : "Updated timeSpent value in database",
                //updatedPomodoro
            })
        }

        // if we are here , it means that we have a user and he has focused on this subject earlier , but not on the date given
        const updatedPomodoro = await Pomodoro.findOneAndUpdate(
            {user : userid},
            {$push : {focusSessionData : {
                subject : subject,
                timeSpent : timespent,
                date : receivedDateObj
            }}},
            {new : true}
        )

        return res.status(200).json({
            message : "added a new entry for this day and subject for the given user",
            //updatedPomodoro
        })      
    } catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
})
module.exports = router;