const mongoose = require('mongoose');

const petSplashSchema = mongoose.Schema({
    title: { type: String },
    imageUrl: { type: String },
});

const PetSplash = mongoose.model('PetSplash',petSplashSchema);
exports.PetSplash = PetSplash;