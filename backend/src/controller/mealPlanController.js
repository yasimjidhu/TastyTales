const MealPlan = require('../models/mealPlanner')

const getMealPlan = async (req, res) => {
  try {

    const plan = await MealPlan.aggregate([
      { $match: { userId: req.user._id } },

      // Convert Map to array of { day, meals } for unwinding
      {
        $project: {
          userId: 1,
          weekStart: 1,
          createdAt: 1,
          updatedAt: 1,
          meals: { $objectToArray: "$meals" },
        },
      },

      // Unwind meals array
      { $unwind: "$meals" },

      // Lookup breakfast
      {
        $lookup: {
          from: "recipes",
          localField: "meals.v.breakfast",
          foreignField: "_id",
          as: "meals.v.breakfast",
        },
      },
      {
        $unwind: {
          path: "$meals.v.breakfast",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Lookup lunch
      {
        $lookup: {
          from: "recipes",
          localField: "meals.v.lunch",
          foreignField: "_id",
          as: "meals.v.lunch",
        },
      },
      {
        $unwind: {
          path: "$meals.v.lunch",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Lookup dinner
      {
        $lookup: {
          from: "recipes",
          localField: "meals.v.dinner",
          foreignField: "_id",
          as: "meals.v.dinner",
        },
      },
      {
        $unwind: {
          path: "$meals.v.dinner",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Reconstruct meals as object
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          weekStart: { $first: "$weekStart" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          meals: {
            $push: {
              k: "$meals.k",
              v: "$meals.v",
            },
          },
        },
      },

      {
        $project: {
          userId: 1,
          weekStart: 1,
          createdAt: 1,
          updatedAt: 1,
          meals: { $arrayToObject: "$meals" },
        },
      },
    ]);

    res.json(plan[0] || {}); // Return first (and only) document
  } catch (err) {
    console.error("Error in getMealPlan:", err);
    res.status(500).json({ message: "Error fetching meal plan" });
  }
};


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