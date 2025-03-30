const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Pomodoro = require("../models/pomodoroSchema");
const User = require("../models/userModel");
const Badge = require("../models/badgeSchema");
const mongoose = require("mongoose");
const checkBadgeFromPomodoroTime = require("../helperfunction/badgeFromPomodoroTime");
const checkBadgeFromLevel = require("../helperfunction/badgeFromLevel");

// route to fetch all subjects in pomodoro (works , tested on postman)
router.get("/fetchalltags/:userid",authMiddleware,async(req,res)=>{
    try{
        const {userid} = req.params;

        const subjects = await Pomodoro.findOne({
            user: userid,
        })
            .select("focusSessionData.subject")
            .lean();

        // use .lean() only when u want to read the result
        // without .lean() , the subjects variable will store the mongodb object , which will have properties like .save() , .populate() etc , which isnt really needed here (makes the query faster)

        if (!subjects) {
            return res.status(404).json({
                message: "No valid pomodoro session for user yet",
            });
        }
        const subjectList =  [...new Set(subjects?.focusSessionData.map(item => item.subject))];

        return res.status(200).json({
            message: "all subjects fetched successfully!",
            subjectList,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error!",
        });
    }
});

// route to send the focus session data to the frontend for analytics (works , tested on postman)
router.get("/fetchuseranalytics/:userid",authMiddleware,async(req,res)=>{
    try{
        const {userid} = req.params;

        const focusdata = await Pomodoro.findOne({ user: userid })
            .select("focusSessionData user")
            .populate("user", "name")
            .lean();
        if (!focusdata) {
            return res.status(404).json({
                message: "No pomodoro data on the specified user",
            });
        }

        return res.status(200).json({
            message: "fetched the data successfully",
            focusdata,
            //userId : userid
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// route for updating focus session data for user (works , tested on postman)
router.post("/insertfocussessiondata/:userid",authMiddleware,async(req,res)=>{

    // since the time user uses a pomodoro is always an increasing function , we can for sure say that everytime a user earns a badge related to time spent on pomodoro , that will be a unique badge. So , technically speaking , we dont really need to check if the user earned that badge already
    try{
        const {userid} = req.params;

        let user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({
                message: "User does not exist!",
            });
        }
        const { subject, timespent, date } = req.body;

        if (!subject || !timespent || !date) {
            return res.status(400).json({
                message: "Please provide subject , timespent and date",
            });
        }

        const receivedDateObj = new Date(date);
        receivedDateObj.setUTCHours(0,0,0,0); // normalise to UTC midnight (we are doing this to normalise and standardise the dates everywhere)


        //userExists.totalPomodoroTime+=timespent;
        user = await User.findByIdAndUpdate(
            userid,
            {$inc : {totalPomodoroTime : timespent}},
            {new : true}
        )
        const badgeId = checkBadgeFromPomodoroTime(user.totalPomodoroTime);
        let badgeImages=[];
        if(badgeId){
            //userExists.unlockedBadges = [...new Set([...userExists.unlockedBadges,badgeId])];
            let badgelink = await Badge.findById(badgeId).select('badgeLink')
            badgeImages.push(badgelink);
            user = await User.findByIdAndUpdate(
                userid,
                {$addToSet : {unlockedBadges : badgeId}},
                {new : true}
            )
        }

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
                { new: true, upsert: true} // Create if not exists
            );

            // userExists.auraPoints+=20;
            // userExists.xp+=20;
            user = await User.findByIdAndUpdate(
                userid,
                {$inc : {auraPoints : 20, xp : 20}},
                {new : true}
            )

            // calculate next level threshold
            const nextLevelPoints = 100 * (user.level + 1) ** 2;
            // Check if user qualifies for a level up
            if (user.xp >= nextLevelPoints) {
                // userExists.level += 1; // Level up
                // userExists.xp=0;
                user = await User.findByIdAndUpdate(
                    userid,
                    {$inc : {level : 1},$set : {xp : 0}},
                    {new : true}
                )
                let levelupbadgeid = checkBadgeFromLevel(user.level);
                if(levelupbadgeid) {
                    let len1 = user.unlockedBadges.length || 0;
                    user = await User.findByIdAndUpdate(
                        userid,
                        {$addToSet : {unlockedBadges : levelupbadgeid}},
                        {new : true}
                    )
                    let len2 = user.unlockedBadges.length || 0;
                    if(len1!==len2){
                        let levelupbadge = await Badge.findById(levelupbadgeid).select("badgeLink");
                        badgeImages.push(levelupbadge);
                    }
                }
                console.log(`Congratulations! ${user.name} reached Level ${user.level}`);
            }

            //await userExists.save({session});
            return res.status(200).json({
                message : "User recorded in the database!",
                badgeImages
                //updatedPomodoro
            })
        }

        // if we are here , it means that the user has used pomodoro atleast once
        const pomodoro = await Pomodoro.find(
            {user : userid,"focusSessionData.subject" : subject}
        )

        // check if the user had a pomodoro session today
        const checkSessionExists = await Pomodoro.findOne({
            user : userid,
            "focusSessionData.date" : receivedDateObj
        })

        if(!pomodoro.length){
            if(!checkSessionExists){
                // since this is the first time user is doing pomodoro today , give them auraPoints
                // userExists.auraPoints+=20;
                // userExists.xp+=20;
                user = await User.findByIdAndUpdate(
                    userid,
                    {$inc : {auraPoints : 20, xp : 20}},
                    {new : true}
                )

                // calculate next level threshold
                const nextLevelPoints = 100 * (user.level + 1) ** 2;
                // Check if user qualifies for a level up
                if (user.xp >= nextLevelPoints) {
                    //userExists.level += 1; // Level up
                    user = await User.findByIdAndUpdate(
                        userid,
                        {$inc : {level : 1},$set : {xp : 0}},
                        {new : true}
                    )
                    let levelupbadgeid = checkBadgeFromLevel(user.level);
                    // if(levelupbadgeid) {
                    //     let levelupbadge = await Badge.findById(levelupbadgeid).select("badgeLink");
                    //     badgeImages.push(levelupbadge);
                    //     user = await User.findByIdAndUpdate(
                    //         userid,
                    //         {$addToSet : {unlockedBadges : levelupbadgeid}},
                    //         {new : true}
                    //     )
                    // }
                    if(levelupbadgeid) {
                        let len1 = user.unlockedBadges.length || 0;
                        user = await User.findByIdAndUpdate(
                            userid,
                            {$addToSet : {unlockedBadges : levelupbadgeid}},
                            {new : true}
                        )
                        let len2 = user.unlockedBadges.length || 0;
                        if(len1!==len2){
                            let levelupbadge = await Badge.findById(levelupbadgeid).select("badgeLink");
                            badgeImages.push(levelupbadge);
                        }
                    }
                    console.log(`Congratulations! ${user.name} reached Level ${user.level}`);
                }

                //await userExists.save();
            }
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
                badgeImages
                //updatedPomodoro
            })
        }

        // if we are here , means that we already have some entries for a given subject for this user

        // perform linear search to find if current date already exists for the given subject
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
                badgeImages
                //updatedPomodoro
            })
        }

        // if we are here , it means that we have a user and he has focused on this subject earlier , but not on the date given

        if(!checkSessionExists){
            // since this is the first time user is doing pomodoro today , give them auraPoints
            // userExists.auraPoints+=20;
            // userExists.xp+=20;
            user = await User.findByIdAndUpdate(
                userid,
                {$inc : {auraPoints : 20, xp : 20}},
                {new : true}
            )

            // calculate next level threshold
            const nextLevelPoints = 100 * (user.level + 1) ** 2;
            // Check if user qualifies for a level up
            if (user.xp >= nextLevelPoints) {
                //userExists.level += 1; // Level up
                user = await User.findByIdAndUpdate(
                    userid,
                    {$inc : {level : 1},$set : {xp : 0}},
                    {new : true}
                )
                let levelupbadgeid = checkBadgeFromLevel(user.level);
                // if(levelupbadgeid) {
                //     let levelupbadge = await Badge.findById(levelupbadgeid).select("badgeLink");
                //     badgeImages.push(levelupbadge);
                //     user = await User.findByIdAndUpdate(
                //         userid,
                //         {$addToSet : {unlockedBadges : levelupbadgeid}},
                //         {new : true}
                //     )
                // }
                if(levelupbadgeid) {
                    let len1 = user.unlockedBadges.length || 0;
                    user = await User.findByIdAndUpdate(
                        userid,
                        {$addToSet : {unlockedBadges : levelupbadgeid}},
                        {new : true}
                    )
                    let len2 = user.unlockedBadges.length || 0;
                    if(len1!==len2){
                        let levelupbadge = await Badge.findById(levelupbadgeid).select("badgeLink");
                        badgeImages.push(levelupbadge);
                    }
                }
                console.log(`Congratulations! ${user.name} reached Level ${user.level}`);
            }

            //await userExists.save();
        }
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
            badgeImages
            //updatedPomodoro
        })      
    } catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
});

// router.post("/insertfocussessiondata/:userid", authMiddleware, async (req, res) => {
//     try {
//         const { userid } = req.params;
//         const { subject, timespent, date } = req.body;

//         if (!subject || !timespent || !date) {
//             return res.status(400).json({ message: "Please provide subject, timespent, and date" });
//         }

//         const user = await User.findById(userid);
//         if (!user) {
//             return res.status(404).json({ message: "User does not exist!" });
//         }

//         const receivedDateObj = new Date(date);
//         receivedDateObj.setUTCHours(0, 0, 0, 0);

//         let updateQuery = { $inc: { totalPomodoroTime: timespent } };
//         let badgeImages = []; // his will store the badges that the user earns after this update is carried out

//         const badgeId = checkBadgeFromPomodoroTime(user.totalPomodoroTime + timespent);
//         if (badgeId) {
//             updateQuery.$addToSet = { unlockedBadges: badgeId };
//             let badgelink = await Badge.findById(badgeId).select("badgeLink");
//             if (badgelink) badgeImages.push(badgelink);
//         }

//         // Check if the user has previous pomodoro sessions
//         const existingSession = await Pomodoro.findOne({
//             user: userid,
//             "focusSessionData": { $elemMatch: { subject: subject, date: receivedDateObj } }
//         });

//         if (existingSession) {
//             updateQuery.$inc["focusSessionData.$.timeSpent"] = timespent;
//         } else {
//             updateQuery.$push = { focusSessionData: { subject, timeSpent: timespent, date: receivedDateObj } };
//         }

//         // First-time daily bonus
//         const todaySession = await Pomodoro.findOne({ user: userid, "focusSessionData.date": receivedDateObj });
//         if (!todaySession) {
//             // since multiple conditions can trigger the increase of aurapoints and xp , so we have to use cumulative sum
//             updateQuery.$inc.auraPoints = (updateQuery.$inc.auraPoints || 0) + 20;
//             updateQuery.$inc.xp = (updateQuery.$inc.xp || 0) + 20;
//         }

//         // Level-up check
//         const nextLevelPoints = 100 * (user.level + 1) ** 2;
//         if ((user.xp || 0) + (updateQuery.$inc.xp || 0) >= nextLevelPoints) {
//             // since level is only increased if xp is above a certain threshold , that is , there is only one trigger to increase the level , we will NOT use cumulative sum
//             updateQuery.$inc.level = 1;
//             updateQuery.$set = { xp: 0 };
//             let levelupbadge = checkBadgeFromLevel(user.level+1);
//             if(levelupbadge){
//                 let levelupbadgelink = await Badge.findById(levelupbadge).select('badgeLink')
//                 if(levelupbadgelink) badgeImages.push(levelupbadgelink)
//             }
//         }

//         // Perform a single update operation
//         const updatedUser = await User.findByIdAndUpdate(userid, updateQuery, { new: true, upsert: true });

//         return res.status(200).json({
//             message: "User data successfully updated!",
//             badgeImages,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// });

module.exports = router;
