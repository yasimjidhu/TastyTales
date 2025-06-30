const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  image: { type: String, default: ""},
  phone: { type: String, default: "" },
  likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipes' }],
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipes' }],
  madeItRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipes' }]


}, { timestamps: true });

module.exports = mongoose.model("users", UserSchema);
