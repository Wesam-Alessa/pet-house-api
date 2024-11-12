const mongoose = require('mongoose');
const { User } = require('../users/user');

const messasgeSchema = mongoose.Schema({
     sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: User
     },
     content:{type:String,trim:true},
     receiver:{type:String,trim:true},
     chat: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat"
    },
     readBy:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: User
           
        }
     ],
    createdAt:{
        type: Date,
        default:Date.now
    },
    updatedAt:{
        type: Date,
        default:Date.now
    }
    
});

module.exports = mongoose.model('Message', messasgeSchema);