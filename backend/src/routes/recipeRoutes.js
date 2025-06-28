const express = require("express");
const recipeController = require('../controller/recipeController');
const  authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",recipeController.addRecipe)

router.get('/search', recipeController.searchRecipes);

router.get("/:id",recipeController.getOne);

router.get("/",recipeController.getAll)

router.post('/:recipeId/like',authMiddleware, recipeController.likeOrUnlike);

router.post('/:recipeId/save',authMiddleware, recipeController.saveOrUnsave);

router.post('/:recipeId/review', authMiddleware, recipeController.addReview);

module.exports = router;
