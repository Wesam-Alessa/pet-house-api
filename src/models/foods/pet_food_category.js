const mongoose = require('mongoose');

const petFoodsCategorySchema = mongoose.Schema({
    label: { type: String },
    imageUrl: { type: String },
    hidden: { type: Boolean },
});

const PetFoodsCategory = mongoose.model('Pet_Foods_Categories',petFoodsCategorySchema);
exports.PetFoodsCategory = PetFoodsCategory;