const mongoose = require('mongoose');
const multer = require('multer');

const toolSchema = new mongoose.Schema({
  name: { type: String },
  quantity: { type: Number },
  color: { type: String },
  image: [{
    // webContentLink for dounload file 
    webViewLink: {type: String},
    // webViewLink for show this file
    webContentLink: {type: String} 
  }],
  seller: {},
  price:{type : Number},
  description :{type: String} ,
  location:{type: String} ,
  status:{type: String} ,
  category:{type: String} ,
  viewCount: { type: Number },
  createdDate:{type: String} ,
  updatedDate:{type: String} ,
  isFeatured: { type: Boolean },
  waiting: { type: Boolean },
  hidden: { type: Boolean },
  reports: {type: Array}
});

const Tool = mongoose.model('Pet_Tools', toolSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

exports.Tool = Tool;
exports.Upload = upload;
