const express = require("express");
const {
  getSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controller/scheduleController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// GET all schedules for a kitchen
router.get("/:kitchenId", getSchedules);

// POST new schedule
router.post("/:kitchenId", addSchedule);

// PUT update schedule
router.put("/:scheduleId", updateSchedule);

// DELETE a schedule
router.delete("/:scheduleId", deleteSchedule);

module.exports =  router;
