const mongoose = require("mongoose");

const toolsSellerSchema = mongoose.Schema({
    id: {type : String},
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    picture: {type:String},
    address: {type:String},
    // favourites: {type:Array},
    // myPets: {type:Array},
});

const ToolsSeller = mongoose.model("Tools_Seller",toolsSellerSchema);

exports.ToolsSeller = ToolsSeller; 
exports.toolsSellerSchema = toolsSellerSchema;