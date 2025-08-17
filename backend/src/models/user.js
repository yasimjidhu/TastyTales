const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  expoToken: String,
  image: { type: String, default: "" },
  phone: { type: String, default: "" },

  likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipes' }],
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipes' }],
  madeItRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipes' }],

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],

  // 🔹Preferences for personalization
  preferencesCompleted: { type: Boolean, default:false },
  preferences: {
    foodType: {
      type: String,
      enum: ["veg", "non-veg", "vegan", "eggetarian", "none"],
      default: "none"
    },
    lifestyle: {
      type: String,
      enum: ["hostler", "student", "professional", "homemaker", "other"],
      default: "other"
    },
    skill: { type: String, enum: ["beginner", "intermediate", "expert"], default: "beginner" },
    cuisines: [{ type: String }], // Example: ["indian", "italian", "chinese"]
    allergies: [{ type: String }], // Example: ["nuts", "gluten", "dairy"]
    healthGoals: [{ type: String }], // Example: ["weight-loss", "high-protein"]
  }
}, { timestamps: true });

module.exports = mongoose.model("users", UserSchema);
