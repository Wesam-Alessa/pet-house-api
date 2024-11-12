const router = require("express").Router();
const reportsController = require("../../controllers/reports_controller");
const middlewareAuth = require("../../middleware/auth");
//middlewareAuth

router.post("/check-objection-report", reportsController.checkObjectionReport);

router.post("/send-objection-report", reportsController.postObjectionReport);

router.get("/get-objection-reports",middlewareAuth, reportsController.getObjectionReports);

router.get("/get-objection-reports",middlewareAuth, reportsController.getObjectionReports);

router.post("/answer-on-objection-report",middlewareAuth, reportsController.answerOnObjectionReport);

router.delete("/remove-objection-report",middlewareAuth, reportsController.removeFeedbackReport);

module.exports = router;