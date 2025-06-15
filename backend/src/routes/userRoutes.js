const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userController = require('../controller/userController')

const router = express.Router();

// Register a new user
router.post("/register",userController.register)

// Login
router.post("/login",userController.login);

// Update user profile image
router.post("/:userId/profile-image",userController.updateProfileImage);

// get user profile
router.get('/:userId',userController.getUserProfile);

// Update user profile
router.put('/:userId', userController.updateUserProfile);

module.exports = router;
