const Inventory = require("../models/inventory");
const Kitchen = require("../models/kitchen");

// ✅ Get inventory for a kitchen
const getInventory = async (req, res) => {
  try {
    const { kitchenId } = req.params;

    const items = await Inventory.find({ kitchenId }).sort({ createdAt: -1 });

    console.log("fetched inventory items", items);
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add a new inventory item to a kitchen
const addInventoryItem = async (req, res) => {
  try {
    console.log("addinv item body", req.body);
    const { name, quantity, unit, addedBy, category, lowStock, kitchenId } = req.body;

    if (!name || !quantity || !kitchenId) {
      return res
        .status(400)
        .json({ error: "Ingredient name, quantity and kitchenId are required" });
    }

    const newItem = new Inventory({
      kitchenId,
      userId:req.user._id, 
      addedBy, 
      name,
      quantity,
      unit,
      category,
      isLowsStock: lowStock || false,
    });

    await newItem.save();

    console.log("item saved successfully", newItem);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update an inventory item (no user filter, only kitchen-level)
const updateInventoryItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;
    console.log("update item body", updates);

    const item = await Inventory.findByIdAndUpdate(itemId, updates, { new: true });

    if (!item) return res.status(404).json({ error: "Item not found" });

    console.log("item updated successfully", item);
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete an inventory item (no user filter, just by id)
const deleteInventoryItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Inventory.findByIdAndDelete(itemId);

    if (!item) return res.status(404).json({ error: "Item not found" });

    res.status(200).json({ message: "Item deleted successfully", item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};
