const Schedule = require('../models/schedule')

// ✅ Get schedules for a kitchen
// ✅ Get schedules for a kitchen
exports.getSchedules = async (req, res) => {
  try {
    const { kitchenId } = req.params;

    const schedules = await Schedule.find({ kitchenId }).sort({ createdAt: -1 });

    res.status(200).json(schedules);
  } catch (err) {
    console.error("Error fetching schedules:", err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ Add new schedule
exports.addSchedule = async (req, res) => {
  try {
    const { kitchenId } = req.params;

    const { day, cook, dish, time } = req.body;

    const schedule = new Schedule({ kitchenId, day, cook, dish, time });
    await schedule.save();

    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Update schedule
exports.updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const updates = req.body;

    const schedule = await Schedule.findByIdAndUpdate(scheduleId, updates, {
      new: true,
    });

    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    res.status(200).json(schedule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const deleted = await Schedule.findByIdAndDelete(scheduleId);
    if (!deleted) return res.status(404).json({ error: "Schedule not found" });

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
