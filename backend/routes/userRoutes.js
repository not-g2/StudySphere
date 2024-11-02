const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const User = require('../db/index');

// end point to upload profile picture
router.post('/')