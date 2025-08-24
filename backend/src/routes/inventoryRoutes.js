const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const inventoryController = require("../controller/inventoryController");

router.use(authMiddleware);

router.get("/:kitchenId", inventoryController.getInventory);

// Add new inventory item
router.post("/item", inventoryController.addInventoryItem);

// Update an existing inventory item
router.patch("/item/:itemId", inventoryController.updateInventoryItem);

// Delete an inventory item
router.delete("/item/:itemId", inventoryController.deleteInventoryItem);

module.exports = router;
