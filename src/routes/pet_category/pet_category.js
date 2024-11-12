const express = require('express')
const router = express.Router();
const { google } = require('googleapis');
const cloudinary = require('cloudinary').v2;
const formidable= require('formidable');
const fs = require('fs');
const {PetCategory} = require('../.././models/pet/pet_category');
const multer = require('multer');
const storage = multer.memoryStorage();
const uploads = multer({ storage });
const apiConsts = require('../../core/api_const') ;
const middlewareAuth = require("../../middleware/auth");
const client_id = apiConsts.CLIENT_ID;
const client_secret = apiConsts.CLIENT_SECRET;
const redirect_uris = apiConsts.REDIRECT_URIS;
const oAuth2Client = new google.auth.OAuth2(client_id,client_secret,redirect_uris[0]);
const {User} = require('../../models/users/user');


router.post('/update_pet_category',middlewareAuth,uploads.single('file'),async (req,res)=>{
  if(req.header("x-auth-token") == undefined || req.header('uid') == undefined ||
           req.header("x-auth-token") == "" || req.header('uid') == "" ) {
    return res.status(401).send("ERROR : some data error, please enter correct data ! ");
  }   
  let user = await User.findById(req.header('uid'));
  if(!user){
    return res.status(404).send("ERROR : this user not found ! ");
  }
  if(user.isAdmin == false){
    return res.status(404).send("ERROR : this user not admin to add new category ! ");
  }

  let category = await PetCategory.findById(req.header('cid'));
  if(!category){
    return res.status(404).send("ERROR : this category not found ! ");
  }

  if(req.file != null) {
    cloudinary.uploader.upload_stream({ folder: 'pet_house_server/categories' }, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
     category.label=req.body.label;
     category.imageUrl=result.secure_url;
     category.hidden=req.body.hidden;
      category.save((err) => {
      if (err) {  
          return res.status(500).send(err)       
        }
        res.status(200).send(category)
      })  

  }).end(req.file.buffer);
  }
  else {
    category.label=req.body.label;
    category.imageUrl=req.body.imageUrl;
    category.hidden=req.body.hidden;

      category.save((err) => {
      if (err) {  
          return res.status(500).send(err)       
        }
       return res.status(200).send(category)
      })  
  }

})

router.post('/add_pet_category',middlewareAuth,uploads.single('file'),async (req,res)=>{
  if(req.header("x-auth-token") == undefined || req.header('uid') == undefined ||
           req.header("x-auth-token") == "" || req.header('uid') == "" ) {
    return res.status(401).send("ERROR : some data error, please enter correct data ! ");
  }   
  let user = await User.findById(req.header('uid'));
  if(!user){
    return res.status(404).send("ERROR : this user not found ! ");
  }
  if(user.isAdmin == false){
    return res.status(404).send("ERROR : this user not admin to add new category ! ");
  }
  //Upload the file to Cloudinary
  cloudinary.uploader.upload_stream({ folder: 'pet_house_server/categories' }, (error, result) => {
  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
    const category = PetCategory({
    label:req.body.label,
    imageUrl:result.secure_url,
    hidden: false
    });

    category.save((err) => {
    if (err) {  
        return res.status(500).send(err)       
      }
      res.status(200).send(category)
    })  

}).end(req.file.buffer);
})

router.post('/add_pet_category_drive',async (req,res)=>{
    var form = new formidable.IncomingForm();
    form.parse(req,(err,fields,files)=>{
     console.log(fields)
     if(fields.label == undefined || files.image.originalFilename == undefined)return res.send('label or image not founded !');
     if(err) res.status(400).send(err);
     const token = apiConsts.GOOGLE_DRIVE_TOKEN;
     //JSON.parse(fields.token);
     if(token == null || token == '' || token == {} )return res.status(400).send('Token Not Found !');
     oAuth2Client.setCredentials(token);
     const drive = google.drive({version:'v3',auth:oAuth2Client,});
     const fileMetadata = {name:files.image.name,parents: [apiConsts.FOLDER_ID],  };
     const media = {mimeType:files.image.mimetype,body:fs.createReadStream(files.image.filepath)};
     drive.files.create({resource:fileMetadata,media:media,fields:"id"},(err,file)=>{
       drive.permissions.create({fileId:file.data.id,requestBody:{role:'reader',type:'anyone'}});
       drive.files.get({fileId:file.data.id ,fields: 'webViewLink , webContentLink'},(err,result)=>{
       const category = PetCategory({
          label:fields.label,
          imageUrl:apiConsts.GOOGLE_DRIVE_IMAGE_URL + file.data.id
          //result.data.webViewLink,
            });
 
    category.save((err) => {
          if (err) {  
              oAuth2Client.setCredentials(null);  
              return res.status(500).send(err)       
             }
             res.status(200).send(category)
          }) 
       });
         oAuth2Client.setCredentials(null);
     });
   });   
})

router.get('/get_pet_category',middlewareAuth,async (req,res)=>{
    if(req.header("x-auth-token") == undefined || req.header('uid') == undefined ||
      req.header("x-auth-token") == "" || req.header('uid') == "" ) {
      return res.status(401).send("ERROR : some data error, please enter correct data ! ");
    }   
    let user = await User.findById(req.header('uid'));
    if(!user){
    return res.status(404).send("ERROR : this user not found ! ");
    }
    let categories = await PetCategory.find();
    if(user.isAdmin == false){
    categories = categories.filter(item => item.hidden != true);
      return res.status(200).send(categories); 
    }
    else if(user.isAdmin == true) {
      return res.status(200).send(categories); 
    }

     
})

module.exports = router