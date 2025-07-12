const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const groceryController = require("../controller/groceryController");

router.use(authMiddleware)

router.get("/", groceryController.getGroceryList);
router.post("/item", groceryController.addGroceryItem);
router.patch("/item", groceryController.updateGroceryItem);
router.delete("/item/:itemId", groceryController.deleteGroceryItem);

module.exports = router;