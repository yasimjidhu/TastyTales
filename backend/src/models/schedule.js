const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    kitchenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kitchen",
      required: true,
    },
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    cook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dish: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String, // "19:00"
      required: true,
    },
  },
  { timestamps: true }
);

module.exports =  mongoose.model("Schedule", scheduleSchema);
