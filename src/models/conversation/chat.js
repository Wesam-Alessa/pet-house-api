const mongoose = require('mongoose');
const { User } = require('../users/user');

const chatSchema = mongoose.Schema({
     chatName:{type:String,trim:true},
     isGroupChat:{type:Boolean,default:false},
     users:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: User
        }
     ],
     latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Message"
     },
     groupAdmin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: User
     },
     createdAt:{
      type: Date,
      default:Date.now
     },
     updatedAt:{
      type: Date,
      default:Date.now
     }
},{timestamp: true});

module.exports = mongoose.model('Chat', chatSchema);