const MealPlan = require('../models/mealPlanner')

const getMealPlan = async (req, res) => {
    try {
        const plan = await MealPlan.findOne({ userId: req.user._id })
        console.log('meal plan', plan)
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

        const updated = await MealPlan.findOneAndUpdate(
            { userId: req.user._id },
            { weekStart, meals, userId: req.user._id },
            { new: true, upsert: true }
        );

        res.json(updated);
    } catch (err) {
        console.error('Meal plan saving error:', err);
        res.status(500).json({ message: "Error saving meal plan" });
    }
};


module.exports = {
    getMealPlan,
    saveMealPlan
}