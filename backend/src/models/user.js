const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  expoToken:String,
  image: { type: String, default: "" },
  phone: { type: String, default: "" },
  likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipes' }],
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipes' }],
  madeItRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipes' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
}, { timestamps: true });

module.exports = mongoose.model("users", UserSchema);
