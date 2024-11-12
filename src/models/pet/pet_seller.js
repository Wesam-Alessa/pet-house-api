const mongoose = require("mongoose");

const sellerSchema = mongoose.Schema({
    id: {type : String},
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    picture: {type:String},
    address: {type:String},
    // favourites: {type:Array},
    // myPets: {type:Array},
});

const PetSeller = mongoose.model("PetSeller",sellerSchema);

exports.PetSeller = PetSeller; 
exports.sellerSchema = sellerSchema;