const express = require('express')
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { google } = require('googleapis');
const formidable= require('formidable');
const fs = require('fs');
const {PetSplash} = require('../../models/pet/pet_splash');
const multer = require('multer');
const storage = multer.memoryStorage();
const uploads = multer({ storage });

const apiConsts = require('../../core/api_const') ;

const client_id = apiConsts.CLIENT_ID;
const client_secret = apiConsts.CLIENT_SECRET;
const redirect_uris = apiConsts.REDIRECT_URIS;
const oAuth2Client = new google.auth.OAuth2(client_id,client_secret,redirect_uris[0]);


 router.post('/add_splash', uploads.single('image'),async (req, res) => {
       //Upload the file to Cloudinary
        cloudinary.uploader.upload_stream({ folder: 'pet_house_server/splash' }, (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Something went wrong' });
          }
          const splash = PetSplash({
          title: req.body.title,
          imageUrl: result.url
          });
          splash.save((err) => {
            if (err) {  
                oAuth2Client.setCredentials(null);  
                return res.status(500).send(err)       
                }
                res.status(200).send(splash)
            }) 

        }).end(req.file.buffer);
  
    });



router.post('/add_splash_drive',async (req,res)=>{
 var form = new formidable.IncomingForm();
 form.parse(req,(err,fields,files)=>{
  console.log(fields)
  if(fields.title == undefined || files.image.originalFilename == undefined)return res.send('label or image not founded !');
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
      console.log(file.data.id);
      const splash = PetSplash({
        title:fields.title,
        imageUrl:apiConsts.GOOGLE_DRIVE_IMAGE_URL + file.data.id
        //result.data.webViewLink,
    });
    splash.save((err) => {
       if (err) {  
           oAuth2Client.setCredentials(null);  
           return res.status(500).send(err)       
          }
          res.status(200).send(splash)
       }) 
    });
      oAuth2Client.setCredentials(null);
  });
});
   
})

router.get('/get_splash_urls',async (req,res)=>{
  const splashes = await PetSplash.find();
  res.status(200).send(splashes);    
})

module.exports = router



//const uploadFile = require('../../controllers/upload');
// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads"), // cb -> callback
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${Math.round(
//       Math.random() * 1e9
//     )}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });

// const handleMultipartData = multer({
//   storage,
//   limits: { fileSize: 1000000 * 5 },
// }).single("image");

// router.post("/testUploadFile",async (req, res) => {
//   handleMultipartData(req, res, async (err) => {
//     if (err) {
//       res.json({ msgs: err.message });
//     }

//     res.json({
//       body: req.body,
//       file: req.file,
//     });
//   });
// });
