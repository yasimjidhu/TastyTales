const MealPlan = require('../models/mealPlanner')

const getMealPlan = async (req, res) => {
    try {
        console.log('get mealplan reached in backed,',req.user._id)
        const plan = await MealPlan.findOne({ userId: req.user._id })
        console.log('meal plan got', plan)
        res.json(plan)
    } catch (err) {
        res.status(500).json({ message: "Error fetching meal plan" })
    }
}

const saveMealPlan = async (req, res) => {
  try {
    const { weekStart, meals } = req.body;

    if (!weekStart || !meals) {
      return res.status(400).json({ message: "meals and week are mandatory" });
    }

    let existingPlan = await MealPlan.findOne({ userId: req.user._id });

    if (existingPlan) {
      // Create a new Map to ensure Mongoose detects the change
      const newMeals = new Map();
      
      // First, copy all existing meals
      if (existingPlan.meals) {
        for (const [day, dayMeals] of existingPlan.meals) {
          // Convert Mongoose subdocument to plain object
          const plainDayMeals = dayMeals.toObject ? dayMeals.toObject() : dayMeals;
          newMeals.set(day, { ...plainDayMeals });
        }
      }

      // Then merge in the new meals
      for (const [day, mealTypes] of Object.entries(meals)) {
        const existingDayMeals = newMeals.get(day) || {};
        
        console.log('existingday meals', existingDayMeals);
        console.log('new meal types', mealTypes);
        
        // Merge existing meals with new meals for this day
        const mergedDayMeals = {
          ...existingDayMeals,
          ...mealTypes,
        };
        
        console.log('merged day meals', mergedDayMeals);
        
        // Set the merged meals to the new Map
        newMeals.set(day, mergedDayMeals);
      }

      // Set the new Map to the document
      existingPlan.meals = newMeals;
      existingPlan.weekStart = weekStart;
      await existingPlan.save();

      console.log("✅ Meal plan updated successfully", existingPlan);
      res.json(existingPlan);
    } else {
      // Create new
      const newPlan = await MealPlan.create({
        userId: req.user._id,
        weekStart,
        meals,
      });
      console.log("✅ New meal plan created", newPlan);
      res.json(newPlan);
    }
  } catch (err) {
    console.error("❌ Meal plan saving error:", err);
    res.status(500).json({ message: "Error saving meal plan" });
  } 
};

module.exports = {
    getMealPlan,
    saveMealPlan
}