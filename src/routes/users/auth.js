const express = require('express')
const router = express.Router();
const formidable= require('formidable');

const {User,signupValidate,signinValidate} = require('../../models/users/user');
const multer = require('multer');
const storage = multer.memoryStorage();

const apiConsts = require('../../core/api_const') ;

const _ = require("lodash");
const bcrypt = require("bcrypt");
const middlewareAuth = require("../../middleware/auth");


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'defjcngkm',
  api_key: '576442852179556',
  api_secret: 'ig6rxmrsoh5KWJXWluF68AXVeCw'
});

const storage1 = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});
const uploads = multer({ storage:storage1 });

router.post('/upload', uploads.array('images'), (req, res) => {
  // If the request has no files, return an error response
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  // Get the public URLs of the uploaded files from Cloudinary
  const imageUrls = req.files.map((file) => file.path);

  // Return the image URLs in the response
  res.json({ images: imageUrls });
});

router.post('/signup',async (req, res) => {
    if(req.body['email'] == undefined || req.body['password'] == undefined ||
     req.body['name'] == undefined || req.body['phone'] == undefined ) {
        console.log(req.body);
        return res.status(401).send("ERROR : some data error, please enter correct data ! ");
    }
    const { error } = signupValidate(req.body);
    if(error){
      console.log(error.message);
      return res.status(402).send({"Error":error.message});
    }
    let user = await User.findOne({email:req.body['email']});
    if(user){
     return res.status(404).send("Error :This user is already registered");
   }
    user = new User( _.pick(req.body,[
        'name','email','password','phone','address','picture','myPets','myPetFoods','myPetTools','favourites','isAdmin','isManager','reports','disabled'
    ]));
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds) ;
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
    const token = user.generateTokens();
    console.log(token)
    res.header('x-auth-token',token).send(_.pick(user,['_id','name','email','phone','address','picture','myPets','myPetFoods','myPetTools','favourites','isAdmin','isManager','reports','disabled']));
 });


 router.post('/signin',async (req, res) => {
    if(req.body['email'] == undefined || req.body['password'] == undefined ){
        return res.status(401).send("ERROR : some data error, please enter correct data ! ");
    }
    const { error } = signinValidate(req.body);
    if(error){
      console.log(error.message);
      return res.status(402).send({"Error":error.message});
    }
    let user = await User.findOne({email:req.body.email});

    if(!user) {
     return res.status(404).send("Error: Invalid email or password ");
    }
    const checkPassword = await bcrypt.compare(req.body.password,user.password) ;
    if(!checkPassword){
      return res.status(404).send("Error: Invalid email or password ");
    }
    if(user.disabled){
      return res.header('x-auth-token','').status(503).send("Error :Your account has been closed by the administration ");
     }
    const token = user.generateTokens();
    console.log(token)
    res.header('x-auth-token',token).send(_.pick(user,['_id','name','email','phone','address','picture','myPets','myPetFoods','myPetTools','favourites','isAdmin','isManager','reports','disabled']));
   });



 module.exports = router