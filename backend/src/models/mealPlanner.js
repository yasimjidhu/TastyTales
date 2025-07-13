const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  weekStart: { type: String, required: true }, 
  meals: {
    type: Map,
    of: new mongoose.Schema({
      breakfast: { type: mongoose.Schema.Types.ObjectId, ref: "recipes" },
      lunch: { type: mongoose.Schema.Types.ObjectId, ref: "recipes" },
      dinner: { type: mongoose.Schema.Types.ObjectId, ref: "recipes" },
    }, { _id: false }), // prevent _id in subdocuments
    default: {},
  },
}, { timestamps: true });

module.exports = mongoose.model('mealPlan', mealPlanSchema);
