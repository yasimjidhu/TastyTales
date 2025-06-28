const { default: mongoose } = require('mongoose');
const Recipe = require('../models/recipe');
const User = require('../models/user')

const getCategoryWiseRecipes = async (req,res)=>{
    try {
        const {category} = req.params;
        if(!category){
            return res.staus(400).json({error:'category is required'})
        }
        console.log('category in getCategoryWiseRecipes',category)
        const recipes = await Recipe.find({category:category.toLowerCase()})
        console.log('length of categorywise products',recipes.length)
        res.json(recipes)
    } catch (error) {
        console.log('error while getting category wise recipes',error)
        res.status(500).json({error:'failed to get recipes under category'})
    }
}

module.exports = {
    getCategoryWiseRecipes
}