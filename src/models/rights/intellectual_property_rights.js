const mongoose = require("mongoose");

const intellectualpropertyrightsSchema = mongoose.Schema({
    text: {type : String},
});

const rightsScheme = mongoose.model("Intellectual property rights",intellectualpropertyrightsSchema);

exports.rightsScheme = rightsScheme; 
exports.IntellectualpropertyrightsSchema = intellectualpropertyrightsSchema;