const mongoose = require('mongoose');

const toolsCategorySchema = mongoose.Schema({
    label: { type: String },
    imageUrl: { type: String },
    hidden: { type: Boolean },
});

const ToolsCategory = mongoose.model('Tools_Categories',toolsCategorySchema);
exports.ToolsCategory = ToolsCategory;