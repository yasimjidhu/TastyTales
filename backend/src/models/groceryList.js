const mongoose = require('mongoose')

const groceryItemSchema = new mongoose.Schema({
    name : String,
    quantity : String,
    category : String,
    recipeId:String,
})

const groceryListSchema = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId},
    items:[groceryItemSchema],
    createdAt:{type:Date,default:Date.now}
})

module.exports = mongoose.model('GroceryList',groceryListSchema)
