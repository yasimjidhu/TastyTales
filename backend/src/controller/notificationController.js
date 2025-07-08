const Notification = require('../models/notificationSchema')
const { default: mongoose } = require("mongoose");

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.aggregate([
            { $match: { recipient: new mongoose.Types.ObjectId(req.user?.id) } },
            { $sort: { createdAt: -1 } },
            { $limit: 50 },
            {
                $lookup: {
                    from: "users",
                    localField: "sender",
                    foreignField: "_id",
                    as: "senderDetails"
                }
            },
            { $unwind: { path: "$senderDetails", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    recipient: 1,
                    sender: 1,
                    type: 1,
                    message: 1,
                    read: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    senderName: "$senderDetails.name",
                    senderImage: "$senderDetails.image"
                }
            }
        ]);
        res.status(200).json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
}

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    console.log('all notification marked as read')
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update notifications" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

module.exports = {
    getNotifications,
    markAllAsRead,
    deleteNotification
}