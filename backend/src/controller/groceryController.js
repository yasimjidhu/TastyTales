const GroceryList = require('../models/groceryList')

const getGroceryList = async (req, res) => {
  try {
    const list = await GroceryList.findOne({ user: req.user.id });
    res.status(200).json(list || { user: req.user.id, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};                                                                                                                                                                                                                                                                                          

const addGroceryItem = async (req, res) => {
  try {
    let list = await GroceryList.findOne({ user: req.user._id });
    const newItems = req.body; 

    if (!Array.isArray(newItems)) {
      return res.status(400).json({ error: "Request body must be an array of items" });
    }

    if (!list) {
      list = new GroceryList({
        user: req.user._id,
        items: newItems,
      });
    }

    for(const newItem of newItems){
        const existingIndex = list.items.findIndex(
            (item)=>
                item.name.toLowerCase() === newItem.name.toLowerCase() &&
                item.recipeId === newItem.recipeId
        );

        if(existingIndex !== -1){
            // merge quantity 
            const existingItem = list.items[existingIndex]
            const existingQty = parseFloat(existingItem.quantity) || 0
            const newQty = parseFloat(newItem.quantity) || 0

            if(!isNaN(existingQty) && !isNaN(newQty)){
                existingItem.quantity = (existingQty + newQty).toString()
            }
        }else{
            // add new item
            list.items.push({
                name:newItem.name,
                quantity:newItem.quantity,
                recipeId:newItem.recipeId || null,
            })
        }
    }

    await list.save();
    console.log('saved list',list)
    res.status(201).json(list);
  } catch (err) {
    console.error("Error in addGroceryItem:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const updateGroceryItem = async (req, res) => {
  try {
    const { itemId, updates } = req.body;
    const list = await GroceryList.findOne({ user: req.user.id });
    const item = list.items.id(itemId);
    if (item) Object.assign(item, updates);
    await list.save();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteGroceryItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const list = await GroceryList.findOne({ user: req.user.id });
    list.items = list.items.filter(item => item._id.toString() !== itemId);
    await list.save();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    getGroceryList,
    addGroceryItem,
    updateGroceryItem,
    deleteGroceryItem
}