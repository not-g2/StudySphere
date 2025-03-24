const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Pomodoro = require("../models/pomodoroSchema");
const User = require("../models/userModel");

// route to fetch all subjects in pomodoro
router.get("/fetchalltags/:userid", authMiddleware, async (req, res) => {
    try {
        const { userid } = req.params;

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
        const subjectList = subjects?.focusSessionData.map(
            (item) => item.subject || []
        );

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

// route to send the focus session data to the frontend for analytics
router.get("/fetchuseranalytics/:userid", authMiddleware, async (req, res) => {
    try {
        console.log("here");
        const { userid } = req.params;

        const focusdata = await Pomodoro.findOne({ user: userid })
            .select("focusSessionData user")
            .populate("user", "name")
            .lean();
        console.log("here");
        if (!focusdata) {
            return res.status(404).json({
                message: "No pomodoro data on the specified user",
            });
        }

        return res.status(200).json({
            message: "fetched the data successfully",
            focusdata,
            userId: userid,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});

// route for updating focus session data for user
router.post(
    "/insertfocussessiondata/:userid",
    authMiddleware,
    async (req, res) => {
        try {
            const { userid } = req.params;

            // since we are using upsert in the query , we need to check if user is a valid user or not before hand

            const userExists = await User.findById(userid);
            if (!userExists) {
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

            const newpomodoro = await Pomodoro.findOneAndUpdate(
                { user: userid },
                {
                    $push: {
                        focusSessionData: {
                            subject: subject,
                            timeSpent: timespent,
                            date: date,
                        },
                    },
                },
                { new: true, upsert: true } // upsert = update + insert , it will update doc if userid exists , otherwise add a new document
            );

            return res.status(200).json({
                message: "User session recorded",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    }
);
module.exports = router;
