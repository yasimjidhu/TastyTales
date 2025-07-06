const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  userName: { type: String },
  userImage: { type: String, default: "" }
}, { timestamps: true });

const RecipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  ingredients: [
    {
      quantity: String,
      name: String  
    }
  ],
  instructions: String,
  image: String,
  level: { type: String, enum: ["easy", "medium", "hard"] },
  likes: { type: Number, default: 0 },
  savesCount: { type: Number, default: 0 },
  calories: { type: Number, default: 0 },
  category: { type: String, enum: ["breakfast", "lunch", "dinner", "snack", "dessert"] },
  cookTime: { type: Number, default: 0 },
  servings: { type: Number, default: 1 },
  isVegetarian: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  reviews: [reviewSchema],
}, { timestamps: true });

module.exports = mongoose.model("recipes", RecipeSchema);
