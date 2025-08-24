const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const kitchenController = require("../controller/kitchenController");

router.use(authMiddleware);

// Get all kitchens user is part of
// router.get("/", kitchenController.getUserKitchens);

// Create a new kitchen
router.post("/", kitchenController.createKitchen);

// Get details of a single kitchen
router.get("/:kitchenId", kitchenController.getKitchen);

// Update kitchen (name, description, etc.)
// router.patch("/:kitchenId", kitchenController.updateKitchen);/

// Delete a kitchen
// router.delete("/:kitchenId", kitchenController.deleteKitchen);

// Invite a member to a kitchen
// router.post("/:kitchenId/invite", kitchenController.inviteMember);

// Accept invite (user joins kitchen using invite link/token)
router.post("/:kitchenId/join", kitchenController.joinKitchen);

// Remove a member from kitchen
// router.delete("/:kitchenId/members/:userId", kitchenController.removeMember);

module.exports = router;
