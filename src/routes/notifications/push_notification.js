const pushNotificationcontroller = require("../../controllers/push_notifications.controller");
const express = require("express");
const router = express.Router();

router.get("/SendNotification",pushNotificationcontroller.SendNotification);
router.post("/SendNotificationToDivice",pushNotificationcontroller.SendNotificationToDivice);

module.exports = router;

