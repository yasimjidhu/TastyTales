const express = require("express");
const recipeController = require('../controller/recipeController');
const  authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",recipeController.addRecipe)

router.get('/search', recipeController.searchRecipes);

router.get('/week', recipeController.getRecipesOfTheWeek);

router.post('/madeIt',authMiddleware,recipeController.markAsMadeIt);

router.get('/madeIt', authMiddleware, recipeController.getMadeItRecipes);

router.get('/saved', authMiddleware, recipeController.getSavedRecipes);

router.post('/suggest',authMiddleware,recipeController.getSuggestedRecipes)

router.get("/:id",recipeController.getOne);

router.get("/",recipeController.getAll)

router.post('/:recipeId/like',authMiddleware, recipeController.likeOrUnlike);

router.post('/:recipeId/save',authMiddleware, recipeController.saveOrUnsave);

router.post('/:recipeId/review', authMiddleware, recipeController.addReview);

module.exports = router;
