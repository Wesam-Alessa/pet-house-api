const chat = require('../models/conversation/chat');
const Message = require('../models/conversation/message')
const {User} = require('../models/users/user')

module.exports = {
    getAllMessage: async(req,res)=>{
        try{
            console.log(req.query);
            const pageSize = 15; //Number of Messages per page
            const page = req.query.page || 1; //Current page number
            // Calculate the of messages to skip 
            const skipMessages = (page -1 ) * pageSize;
            // Find messages with pagination 
            var messages = await Message.find({chat:req.params.id})
                .populate("sender","name picture email")
                .populate("chat")
                .sort({createdAt: -1})
                .skip(skipMessages)
                .limit(pageSize);
                
                messages = await User.populate(messages,{
                    path:"chat.users",
                    select:"name picture email",
                });
                //console.log(messages[0])

               // const token = messages.generateTokens();
               // res.header('x-auth-token',token).json(messages);
                res.json(messages);
                
        }
        catch(err){
            res.status(500).json({error:" Could not retrieve messages "});
        }
    },
    

    sendMessage: async(req,res)=>{
        const {content, chatId, receiver} = req.body;
        if(!content || !chatId){
            return res.status(400).json("Invalid Data !");
        }
        var newMessage = {
            sender: req.user._id,
            content: content,
            receiver: receiver,
            chat: chatId,
        };
        try{
            var message = await Message.create(newMessage);
            message = await message.populate("sender","name picture email");
            message = await message.populate("chat");
            message = await User.populate(message, {
                path:"chat.users",
                select:"name picture email",
            });
            await chat.findByIdAndUpdate(req.body.chatId,{latestMessage:message});
           // const token = User.generateTokens();
           // res.header('x-auth-token',token).json(message);
           //console.log(message)
           res.json(message);
        }
        catch(err){
            res.status(400).json({error:err})
        }
    },
}