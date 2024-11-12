const Chat = require("../models/conversation/chat");
const {User} = require("../models/users/user");

module.exports = {
    accessChat:async(req,res)=>{
        const {userId} = req.body;

        if(!userId){
            res.status(400).json(" Invalid user Id");
        }

        var isChat = await Chat.find({
            isGroupChat:false,
            $and: [
                {users: {$elemMatch: {$eq: req.user._id}},},
                {users: {$elemMatch: {$eq: userId}},},
            ]
        })
        .populate("users","-password")
        .populate("latestMessage");
        isChat = await User.populate(isChat,{
            path:"latestMessage.sender",
            select:"name picture email"
        });
        if(isChat.length > 0 ){
            res.send(isChat[0]);
        }else{
            var chatData = {
                chatName: req.user._id,
                isGroupChat: false,
                users:[req.user._id,userId]

            };
            try{
                const createdChat = await Chat.create(chatData);
                const FullChat = await Chat.findOne({_id:createdChat._id})
                .populate("users","-password");
                //const token = User.generateTokens();
               // res.header('x-auth-token',token).json(FullChat);
               res.json(FullChat);
            }
            catch(err){
                res.status(400).json("Failed to create the chat ");
            }
        }
    },

    getChats: async(req,res)=>{
        try{
            Chat.find({users: {$elemMatch:{$eq:req.user._id}}})
            .populate("users","-password")
            .populate("groupAdmin","-password")
            .populate("latestMessage")
            .sort({updateAt: -1})
            .then(async (results)=>{
                results = await User.populate(results,{
                    path:"latestMessage.sender",
                    select:"name picture email",
                });

               // const token = results[0].generateTokens();
                //res.header('x-auth-token',token).send(results);
                res.send(results);
            })
        }
        catch(err){
            res.status(500).json("Failed to retrieve chat")
        }
    },
}
