const apiConsts = require('../core/api_const') ;
const pushNotificationService = require("../services/push_notification_service");

exports.SendNotification = (req, res, next) => {
    var message = {
        app_id: apiConsts.ONE_SIGNAL_CONFIG.APP_ID,
        contents: {en: "Test Push Notification" },
        included_segments: ["All"],
        content_available: true,
        small_icon: "ic_notification_icon",
        data: {
            PushTitle: "CUSTOM NOTIFICATION"
        }
    }

    pushNotificationService.SendNotification(message, (error, results) => {
        if(error){
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results
        })
    });
};

exports.SendNotificationToDivice = (req, res, next) => {
    var message = {
        app_id: apiConsts.ONE_SIGNAL_CONFIG.APP_ID,
        contents: {en: "Test Push Notification" },
        included_segments: ["included_player_ids"],
        included_player_ids: req.body.devices,
        content_available: true,
        small_icon: "ic_notification_icon",
        data: {
            Pushtitle: "CUSTOM NOTIFICATION"
        }
    }

    pushNotificationService.SendNotification(message, (error, results) => {
        if(error){
            return next(error);
        }
        return res.status(200).send({
            message: "Success",
            data: results
        })
    });
};