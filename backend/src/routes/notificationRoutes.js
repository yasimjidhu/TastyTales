const router = require("express").Router();
const notificationController = require('../controller/notificationController')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.get("/", notificationController.getNotifications);
router.put("/markAllRead", notificationController.markAllAsRead);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
