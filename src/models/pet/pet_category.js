const mongoose = require('mongoose');

const petCategorySchema = mongoose.Schema({
    label: { type: String },
    imageUrl: { type: String },
    hidden: { type: Boolean },
});

const PetCategory = mongoose.model('PetCategory',petCategorySchema);
exports.PetCategory = PetCategory;