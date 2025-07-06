const express = require("express");
const recipeController = require("../controller/recipeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ---------- Public Routes ----------
router.post("/", recipeController.addRecipe);
router.get("/", recipeController.getAll);
router.get("/search", recipeController.searchRecipes);
router.get("/week", recipeController.getRecipesOfTheWeek);
router.get("/popular",recipeController.getPopularRecipes)
router.get("/:id", recipeController.getOne);

// ---------- User-Specific Routes (Require Auth) ----------
router.use(authMiddleware);

router.post("/made-it", recipeController.markAsMadeIt);
router.get("/made-it", recipeController.getMadeItRecipes);

router.get("/saved", recipeController.getSavedRecipes);
router.post("/suggest", recipeController.getSuggestedRecipes);

router.post("/:recipeId/like", recipeController.likeOrUnlike);
router.post("/:recipeId/save", recipeController.saveOrUnsave);
router.post("/:recipeId/review", recipeController.addReview);

module.exports = router;
