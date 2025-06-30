const { default: mongoose } = require('mongoose');
const Recipe = require('../models/recipe');
const User = require('../models/user')

const addRecipe = async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
        await recipe.save();
        res.status(201).json(recipe);
    } catch (error) {
        res.status(400).json({ error: "Failed to create recipe" });
    }
}

const getAll = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate("user", "name");
        res.json(recipes);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: 'Internal Server Error' })
    }
}

const getOne = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: "Recipe ID is required" });
        }
        const recipe = await Recipe.findById(req.params.id)
        if (!recipe) return res.status(404).json({ error: "Recipe not found" });
        res.json(recipe);
    } catch (error) {
        res.status(400).json({ error: "Invalid ID" });
    }
}

const update = async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRecipe);
    } catch (error) {
        res.status(400).json({ error: "Failed to update recipe" });
    }
}

const deleteOne = async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: "Recipe deleted" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete recipe" });
    }
}

const likeOrUnlike = async (req,res)=>{
    const userId = req.user._id
    const { recipeId } = req.params;

    try {
        const user = await User.findById(userId);
        if(user.likedRecipes.includes(recipeId)){
            user.likedRecipes = user.likedRecipes.filter(id => id.toString() !== recipeId);
            await user.save()
            return res.json({ message: "Recipe unliked",user });
        }
        user.likedRecipes.push(recipeId);
        await user.save();
        return res.json({ message: "Recipe liked",user });
    } catch (error) {
        console.error("Error liking recipe:", error);
        return res.status(500).json({ error: "Failed to like recipe" });
    }
}

const saveOrUnsave = async (req, res) => {
    const userId = req.user._id;
    const { recipeId } = req.params;

    try {
        const user = await User.findById(userId);

        if (user.savedRecipes.includes(recipeId)) {
            user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
        } else {
            user.savedRecipes.push(recipeId);
        }
        
        await user.save();

        const updatedUser = await User.findById(userId).populate("savedRecipes");

        return res.json({ message: "Updated", savedRecipes: updatedUser.savedRecipes });
        
    } catch (error) {
        console.error("Error saving recipe:", error);
        return res.status(500).json({ error: "Failed to save recipe" });
    }
}


const addReview = async (req, res) => {
    const { recipeId } = req.params;
    const { rating,comment,userName,userImage } = req.body;

    if (!recipeId || !rating || !comment) {
        return res.status(400).json({ error: "Recipe ID, rating, and comment are required" });
    }
    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ error: "Recipe not found" });

        recipe.reviews.push({
            user: req.user._id,
            rating,
            comment,
            userName: userName || req.user.name,
            userImage: userImage || req.user.image
        });
        await recipe.save();
        res.json(recipe);
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ error: "Failed to add review" });
    }
}

const searchRecipes = async (req, res) => {
    const { q = '', category = '', page = 1, limit = 10 } = req.query;
    const query = {}
    if (q) query.title = { $regex: q, $options: 'i' }; // Case-insensitive search
    if (category) query.category = category.toLowerCase();

    const recipes = await Recipe.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

    const total = await Recipe.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    res.json({
        recipes,
        total,
        currentPage: parseInt(page),
        totalPages
    });
}

const getRecipesOfTheWeek = async (req, res) => {
    try {
        const recipes = await Recipe.find().sort({ likes: -1 }).limit(5);
        res.json(recipes);
    } catch (error) {
        console.error("Error fetching top recipes:", error);
        res.status(500).json({ error: "Failed to fetch recipes of the week" });
    }
}

const markAsMadeIt = async (req, res) => {
    const { recipeId } = req.body
    const userId = req.user;

    try {
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ error: "Recipe not found" });

        const user = await User.findById(userId);
        if (!user.madeItRecipes.includes(recipeId)) {
            user.madeItRecipes.push(recipeId);
            await user.save();
        }
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getMadeItRecipes = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId).populate('madeItRecipes');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const madeItRecipes = user.madeItRecipes;
        if (!madeItRecipes || madeItRecipes.length === 0) {
            return res.status(404).json({ error: "No recipes marked as made" });
        }
        res.json(madeItRecipes);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve made recipes" });
    }
}

const getSavedRecipes = async (req, res) => {
  const userId = req.user._id;

  try {

    const user = await User.findById(userId).populate({
      path: "savedRecipes",
      model: "recipes", 
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const savedRecipes = user.savedRecipes;

    if (!savedRecipes || savedRecipes.length === 0) {
      return res.json([]);
    }

    res.json(savedRecipes);
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    res.status(500).json({ error: "Failed to retrieve saved recipes" });
  }
};


module.exports = {
    addRecipe,
    getAll,
    getOne,
    update,
    deleteOne,
    likeOrUnlike,
    saveOrUnsave,
    addReview,
    searchRecipes,
    getRecipesOfTheWeek,
    markAsMadeIt,
    getMadeItRecipes,
    getSavedRecipes
}