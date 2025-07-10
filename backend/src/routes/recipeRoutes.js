const express = require("express");
const recipeController = require("../controller/recipeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
// ---------- Public Routes ----------
router.get("/", recipeController.getAll);
router.get("/search", recipeController.searchRecipes);
router.get("/week", recipeController.getRecipesOfTheWeek);
router.get("/popular", recipeController.getPopularRecipes);

// ---------- User-Specific Routes ----------
router.use(authMiddleware);

router.post("/", recipeController.addRecipe);
router.get("/saved", recipeController.getSavedRecipes);
router.get('/liked',recipeController.getLikedRecipes)
router.post("/suggest", recipeController.getSuggestedRecipes);
router.get("/made-it", recipeController.getMadeItRecipes);
router.get("/:id", recipeController.getOne);

router.post("/made-it", recipeController.markAsMadeIt);

router.post("/:recipeId/like", recipeController.likeOrUnlike);
router.post("/:recipeId/save", recipeController.saveOrUnsave);
router.post("/:recipeId/review", recipeController.addReview);



module.exports = router;
