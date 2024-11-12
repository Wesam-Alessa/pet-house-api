const router = require("express").Router();
const reportsController = require("../../controllers/reports_controller");
const middlewareAuth = require("../../middleware/auth");


router.post("/send-feedback-report",middlewareAuth, reportsController.postFeedbackReports);

 
router.get("/get-feedback-reports",middlewareAuth, reportsController.getFeedbackReports);

  
router.delete("/remove-feedback-report",middlewareAuth, reportsController.removeFeedbackReport);

module.exports = router;