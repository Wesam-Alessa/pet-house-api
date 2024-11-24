
const express = require('express');
const cors = require("cors");
const compression = require('compression')
const app = express();
const mongoose = require("mongoose");
const cloudinary = require('cloudinary').v2;

const apiConsts = require('./src/core/api_const') ;
const pet = require('./src/routes/pet/pets');
const petCategory = require('./src/routes/pet_category/pet_category');
const toolsCategory = require('./src/routes/tools/tools_categories');
const petTools = require('./src/routes/tools/pet_tools');
const petFoods = require('./src/routes/foods/pet_foods');
const foodsCategory = require('./src/routes/foods/pet_food_categories');
const petSplash = require('./src/routes/pet_splash/pet_splash');
const logger = require('./src/config/logger');
const auth = require('./src/routes/users/auth');
const user = require('./src/routes/users/user');
const rights = require('./src/routes/rights/Intellectual_property_rights');
const deletion_reports = require('./src/routes/reports/deletion_reports');
const feedback_reports = require('./src/routes/reports/feedback_report');
const objectio_reports = require('./src/routes/reports/objection_report');
const chat = require('./src/routes/conversation/chat');
const messages = require('./src/routes/conversation/messages');
const notifications = require('./src/routes/notifications/push_notification');

var corsOptions = {
    //origin: apiConsts.MONGODB_URI
    origin:"http://127.0.0.1:8000"
  };
  mongoose.set("strictQuery", false);
  mongoose.connect('mongodb+srv://wesamalessa53:wesam@cluster0.pl844.mongodb.net/pet_house?retryWrites=true&w=majority',
    //apiConsts.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // وقت المهلة عند اختيار السيرفر
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    // dbName:apiConsts.DBNAME,
 }).then(()=>console.log("Connected"))
 .catch((e)=>logger.error("Failed connection with database server :" + e ));
  //console.log
 cloudinary.config({
   cloud_name: apiConsts.CLOUDINARY_NAME,
   api_key: apiConsts.CLOUDINARY_API_KEY,
   api_secret: apiConsts.CLOUDINARY_API_SECRET
 });
 
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(compression());
app.use("/api/pet_house/pet",pet);
app.use("/api/pet_house/pet_category",petCategory);
app.use("/api/pet_house/tools_category",toolsCategory);
app.use("/api/pet_house/pet_tools",petTools);
app.use("/api/pet_house/pet_foods",petFoods);
app.use("/api/pet_house/foods_category",foodsCategory);
app.use("/api/pet_house/pet_splash",petSplash);
app.use("/api/pet_house/auth",auth);
app.use("/api/pet_house/user",user);
app.use("/api/pet_house/intellectual_property_rights",rights);
app.use("/api/pet_house/reports",deletion_reports);
app.use("/api/pet_house/reports",feedback_reports);
app.use("/api/pet_house/reports",objectio_reports);
app.use("/api/pet_house/chats",chat);
app.use("/api/pet_house/messages",messages);
app.use("/api/pet_house/notifications",notifications);



app.all("*",(req,res,next)=>{
    res.status(404).json({
       status:"false",
       message: "page not found !",
    })
 }); 
 
 //app.listen(apiConsts.PORT,()=>logger.info('App warking on port 8000'));

const server =  app.listen(process.env.PORT || apiConsts.PORT,()=>logger.info('App warking on port ' + process.env.PORT));
//console.log
const io = require("socket.io")(server,{
    pingTimeout:60000,
    cors:{
      //localhost
      origin:"http://127.0.0.1:8000"
      // hosted server
      //origin:"https:..................."
    }
 });

 const activeUsers = new Set();

 io.on("connection",(socket)=>{
  console.log("connected to sockets");
  console.log("active Users => " + activeUsers.size);
  socket.on('setup',(userId)=>{
    activeUsers.add(userId);
    socket.join(userId);
    
    //socket.broadcast.emit('online-user',[...activeUsers]);
    socket.emit('online-user',[...activeUsers]);
    //console.log(userId);
    console.log(" < User connect > " + [...activeUsers]);
  });

  socket.on('re-connect',(userId)=>{
    activeUsers.add(userId);
    //socket.join(userId);
    
    //socket.broadcast.emit('online-user',[...activeUsers]);
    socket.broadcast.emit('re-connect-user',[...activeUsers]);
    //console.log(userId);
    console.log(" < User re-connect > " + [...activeUsers]);
  });

  socket.on('typing',(room)=>{
    console.log("TYPING  "+room);
   // console.log("ROOM");
    socket.to(room).emit('typing',room);
  });

  socket.on('stop typing',(room)=>{
    console.log("STOP TYPING "+room);
    //console.log("ROOM");
    socket.to(room).emit('stop typing',room);
  });

  socket.on('join chat',(room)=>{
    socket.join(room);
    console.log("User Joined : "+ room);
  });
 
  socket.on('new message',(newMessageReceived)=>{
    var chat = newMessageReceived.chat;
    var room = chat.id;
    var sender = newMessageReceived.sender;

    if(!sender){
      console.log(" Sender not defined");
      return;
    }

    var senderId = sender.id;
    console.log(senderId + " message sender ");
    const users = chat.users;

    if(!users){
      console.log(" Users not defined");
      return;
    }

    //console.log("newMessageReceived " + newMessageReceived.createdAt);

    socket.to(room).emit('message received', newMessageReceived);
    socket.to(room).emit('message sent', 'New Message');
  });

  socket.on("user disconnect", (userId) => {
    console.log(" < User disconnect 1> " + userId);
    activeUsers.delete(userId);
    
    socket.broadcast.emit('online-user',[...activeUsers]);
    console.log(" < User disconnect 2> " + activeUsers.size);
  
    //socket.broadcast.emit('online-user',[...activeUsers]);
    //io.emit("user-disconnect",userId);
   // socket.disconnect(true);

  });

  socket.off('setup',(userId)=>{
    console.log(" User offline " + userId);
    activeUsers.delete(userId);
    socket.broadcast.emit('online-user',[...activeUsers]);
    socket.leave(userId);
  })
 })

