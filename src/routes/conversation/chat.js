const router = require("express").Router();
const chatController = require("../../controllers/chat_controller");
const middlewareAuth = require("../../middleware/auth");

//CREATE CHAT 
router.post("/access-chat",middlewareAuth, chatController.accessChat);

//GET CHATS 
router.get("/get-chat",middlewareAuth, chatController.getChats);

module.exports = router;