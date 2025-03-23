const express = require("express");
const router = express.Router();
const Pomodoro = require("../models/pomodoroSchema")
const User = require("../models/userModel");
const authMiddleware = require("../middleware/auth");

// route to fetch all subjects in pomodoro
router.get("/fetchalltags",authMiddleware)

module.exports = router;