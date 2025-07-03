const express = require("express");
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ---------- Public Routes ----------
router.post("/register", userController.register);
router.post("/login", userController.login);

// ---------- Protected Routes ----------
router.use(authMiddleware);

router.get("/:userId", userController.getUserProfile);
router.put("/:userId", userController.updateUserProfile);
router.post("/:userId/profile-image", userController.updateProfileImage);

module.exports = router;
