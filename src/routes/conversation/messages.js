const router = require("express").Router();
const messageController = require("../../controllers/message_controller");
const middlewareAuth = require("../../middleware/auth");

// SEND MESSAGES 
router.post("/send-message",middlewareAuth, messageController.sendMessage);

//GET ALL MESSAGES  
router.get("/get-messages/:id",middlewareAuth, messageController.getAllMessage);

module.exports = router;