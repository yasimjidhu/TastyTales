const { default: mongoose } = require('mongoose');
const Recipe = require('../models/recipe');
const User = require('../models/user')

const getCategoryWiseRecipes = async (req, res) => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (!category) {
            return res.staus(400).json({ error: 'category is required' })
        }

        const filter = { category: category.toLowerCase() };

        const recipes = await Recipe.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        
        const totalCount = await Recipe.countDocuments(filter)
        res.json({
            recipes,
            totalCount,
            currentPage:page,
            totalPages: Math.ceil(totalCount/limit)
        })
    } catch (error) {
        console.log('error while getting category wise recipes', error)
        res.status(500).json({ error: 'failed to get recipes under category' })
    }
}

module.exports = {
    getCategoryWiseRecipes
}