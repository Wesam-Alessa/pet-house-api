const mongoose = require('mongoose');
const multer = require('multer');
const {sellerSchema } = require('./pet_seller');



const petSchema = new mongoose.Schema({
  name: { type: String },
  breed: { type: String },
  quantity: { type: Number },
  ageInYears: { type: Number },
  ageInMonths: { type: Number },
  gender: { type: String },
  weight: { type: Number },
  color: { type: String },
  vaccinations: [{
    name: { type: String },
    expirationDate: { type: String },
  }],
  medicalHistory: { type: String },
  microchipNumber: { type: Number },
  dateOfBirth: { type: String },
  adoptionDate: { type: String },
  sterilized: { type: Boolean },
  image: [{
    // webContentLink for dounload file 
    webViewLink: {type: String},
    // webViewLink for show this file
    webContentLink: {type: String} 
  }],
  seller: {},
  //{id:{type:String}}
  //{type: String},
  price:{type : Number},
  description :{type: String} ,
  location:{type: String} ,
  status:{type: String} ,
  category:{type: String} ,
  viewCount: { type: Number },
  tags: { type: Array },
  options: { type: Array },
  createdDate:{type: String} ,
  updatedDate:{type: String} ,
  isFeatured: { type: Boolean },
  temperature:{type: String} ,
  ph:{type: String} ,
  specificGravity:{type: String} ,
  diet: { type: Array },
  careLevel: {type: String} ,
  waiting: { type: Boolean },
  hidden: { type: Boolean },
  reports: {type: Array}

});

const Pet = mongoose.model('Pet', petSchema);

const storage = 
// multer.diskStorage({
//   destination:(req,file,cd) => {
//       cd(null,"./uploads");
//   },
//   filename:(req,file,cd) => {
//       cd(null,Date.now()+".jpg")
//   }
// });
  multer.memoryStorage();
const upload = multer({ storage: storage })

exports.Pet = Pet;
exports.Upload = upload;
