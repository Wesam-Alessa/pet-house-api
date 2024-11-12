const mongoose = require("mongoose");
const Joi = require('joi');
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    id: {type : String},
    name: {
         type: String,
         min:3,
        max:44,
        required:true,
        },
    email: { 
        type: String,
        required:true,
        unique:true,
        min:3,
        max:255
     },
    password: {
        type: String,
        required:true,
        min:6,
        max:255, },
    phone: { type: String },
    picture: {type:String},
    address: {type:String},
    favourites: {type:Array},
    myPets: {type:Array},
    myPetTools: {type:Array},
    myPetFoods: {type:Array},
    isAdmin:  {
        type:Boolean,
        default:false
    },
    isManager:  {
        type:Boolean,
        default:false
    },
    reports: {type:Array},
    disabled: {
        type:Boolean,
        default:false
    },
    disabledBy :{},
    whyDisabled :{type:String},

});

userSchema.methods.generateTokens = function () {
    const token = jwt.sign({_id:this._id,isAdmin:this.isAdmin,isManager:this.isManager},'privateKey');
    return token;
} 

const User = mongoose.model("Users",userSchema);

function signupValidate(user){
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(44).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(6).max(255).required(),
        phone: Joi.string().min(10).max(10).required(),
        address: Joi.string().min(0).max(255),
        picture:Joi.string().min(0).max(255),
        // favourites:Joi.array(),
        // myPets:Joi.array(),
         isAdmin:Joi.boolean(),
         isManager:Joi.boolean(),
    });
    return schema.validate(user);
};

function signinValidate(user){
    const schema = Joi.object().keys({
        //name: Joi.string().min(3).max(44).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(6).max(255).required(),
       // phone: Joi.string().min(10).max(10).required(),
        //address: Joi.string().min(0).max(255),
       // picture:Joi.string().min(0).max(255),
        // favourites:Joi.array(),
        // myPets:Joi.array(),
        // isAdmin:Joi.boolean()
    });
    return schema.validate(user);
};

exports.User = User; 
exports.signupValidate = signupValidate;
exports.signinValidate = signinValidate;