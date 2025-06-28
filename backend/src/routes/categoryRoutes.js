const express = require("express");
const categoryController = require('../controller/categoryController');
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/:category',categoryController.getCategoryWiseRecipes)

module.exports = router;