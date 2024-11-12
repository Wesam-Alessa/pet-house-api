const express = require('express')
const router = express.Router()
const { google } = require('googleapis')
const formidable= require('formidable');
const fs = require('fs');
const {Pet} = require('../../models/pet/pet');
const {Tool} = require('../../models/tools/tool');
const {Food} = require('../../models/foods/pet_food');


const {User} = require('../../models/users/user');
const {PetSeller} = require('../../models/pet/pet_seller');
const apiConsts = require('../.././core/api_const') ;
const middlewareAuth = require("../../middleware/auth");
const {ActivityReport} = require('../../models/reports/activity_report');
const {ItemDeletionReport} = require('../../models/reports/item_deletion_report');

// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const storage = multer.memoryStorage();
//const uploads = multer({ storage });

// const cloudinary = require('cloudinary').v2;
 //const { CloudinaryStorage } = require('multer-storage-cloudinary');
 const multer  = require('multer');
 const cloudinary = require('cloudinary').v2;
 
 const upload = multer();
cloudinary.config({
  cloud_name: 'defjcngkm',
  api_key: '576442852179556',
  api_secret: 'ig6rxmrsoh5KWJXWluF68AXVeCw'
});

// const storage1 = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'uploads',
//     allowed_formats: ['jpg', 'png', 'jpeg']
//   }
// });
// const uploads = multer({ storage:storage1 });

const client_id = apiConsts.CLIENT_ID;
// cred.web.client_id;
const client_secret = apiConsts.CLIENT_SECRET;
//cred.web.client_secret;
const redirect_uris = apiConsts.REDIRECT_URIS;
//cred.web.redirect_uris;
const oAuth2Client = new google.auth.OAuth2(client_id,client_secret,redirect_uris[0]);
// const scope = [
//   'https://www.googleapis.com/auth/drive.metadata.readonly',
//   'https://www.googleapis.com/auth/userinfo.profile',
//   'https://www.googleapis.com/auth/drive.file',
//   'https://www.googleapis.com/auth/drive.photos.readonly',
//   'https://www.googleapis.com/auth/drive',
// ];

router.get('/get-pets',async(req,res)=> {  
try{
  let pets = (await Pet.find()).filter(e => e.hidden == false && e.waiting == false);
  var newPets = [];
  if(!pets){
    return res.status(404).send("ERROR: Pets not Found !!");
  }
  for(var pet of pets){
    pet.reports = [];
    if(pet.seller.id != ""){
      let user = await User.findById(pet.seller.id);
      if(user){
        pet.seller = userModel(user)
        newPets.push(pet)  
      }
    }
 }
  
  return res.status(200).send(newPets);
  }  
  catch(e){
    return res.status(500).send({'message':e["message"]})   
  }
})

router.get('/get-pet/:id',async(req,res)=>{ 
  const pet = await Pet.findById(req.params.id);
  if(!pet){
    return res.status(404).send("Pet Not Found");
  }
  if(pet.waiting == true || pet.hidden == true){
    return res.status(404).send("Pet Not Found");
  }
  if(pet.seller['id'] !="" && pet.seller['id'] != null && pet.seller['id'] != undefined){
     let user = await User.findById(pet.seller['id']);
       if(!user){
          return res.status(404).send("Pet Not Found");
        }
      pet.seller = userModel(user)
  }
  pet.reports = [];
  return res.status(200).send(pet);
})

router.get('/get-pets/:category',async(req,res)=>{
 try{
  let list = await Pet.find({category:req.params.category});
  const pets = list.filter(e => e.hidden == false && e.waiting == false) 
  var newPets = [];
  if(!pets){
    return res.status(404).send("ERROR: Pets not Found !!");
  }
  for(var pet of pets){
    pet.reports = [];
    if(pet.seller.id != ""){
      let user = await User.findById(pet.seller.id);
      if(user){
        pet.seller = userModel(user)
        newPets.push(pet)  
      }
    }
  }
 return res.status(200).send(newPets);
}
  catch(err){
   return res.status(500).send(err);
  }
})

router.get('/get-search-item/:text',async(req,res)=>{
  try{
   var search = {
    'pets':[],
    'tools':[],
    'foods':[],
   }; 
   let items = (await Pet.find()).filter(e=> 
    e.name.startsWith(req.params.text) &&
   // e.name.includes(req.params.text.slice(1)) 
    //&& 
    e.hidden == false && e.waiting == false);
   //|| e.description.contains(req.params.text)==true&& e.hidden == false && e.waiting == false|| e.description.includes(req.params.text)
   
   var newPets = [];
   if(!items){
    console.log(0)
     return res.status(404).send("ERROR: no items !!");
   }
   for(var pet of items){
     pet.reports = [];
     if(pet.seller.id != ""){
       let user = await User.findById(pet.seller.id);
       if(user){
         pet.seller = userModel(user)
         newPets.push(pet)  
       }
     }
   }

   let tools = (await Tool.find()).filter(e=> 
    e.name.startsWith(req.params.text) &&
    e.hidden == false && e.waiting == false);
   var newTools = [];
   for(var tool of tools){
    tool.reports = [];
     if(tool.seller.id != ""){
       let user = await User.findById(tool.seller.id);
       if(user){
        tool.seller = userModel(user)
        newTools.push(tool)  
       }
     }
   }

   let foods = (await Food.find()).filter(e=> 
    e.name.startsWith(req.params.text) &&
    e.hidden == false && e.waiting == false);
   var newFoods = [];
   for(var food of foods){
    food.reports = [];
     if(food.seller.id != ""){
       let user = await User.findById(food.seller.id);
       if(user){
        food.seller = userModel(user)
        newFoods.push(food)  
       }
     }
   }

   search.pets = newPets
   search.tools = newTools
   search.foods = newFoods

  return res.status(200).send(search);
 }
   catch(err){
    return res.status(500).send(err);
   }
})

router.delete('/remove-pet',middlewareAuth,async(req,res)=>{
try{  if(req.header("x-auth-token") == undefined || req.header("pid") == undefined || req.header("pid") == "") {
    return res.status(401).send("ERROR : some data error, please enter correct data ! ");
  }
  let pet = await Pet.findByIdAndDelete(req.header("pid"));
  if(!pet){
    return res.status(404).send("Pet Not Found");
  }
  return res.status(200).send("Deleted Successfully");}
  catch(e){
    return res.status(500).send({'message':e["message"]})   
  }
})

router.post('/add-new-pet',middlewareAuth,(req,res) => {
try{ 
  var form = new formidable.IncomingForm();
  form.parse(req,async(err,fields,files)=>{
    if(fields.seller == "" ||  fields.seller == null )return res.status(500).send("Seller Not Founded !");
    if(files.image == "")return res.status(500).send("image Not Found !");
    if(fields.diet == [])return res.status(500).send("diet Not Found !");
    if(err) return res.status(400).send(err);
    
    let vaccinations = await JSON.parse(fields.vaccinations);
    var z = [];
    for(const i of vaccinations){
      let x =  await JSON.parse(i);
      z.push(x);
    }
    const list = Object.entries(files).map(([key, value]) => ({ key, value }));
    var urls = [];
    for(const i of list){
        if(i.value['originalFilename'] != '' && i.value['originalFilename'] != null){
          const filePath = i.value['filepath'];
         await cloudinary.uploader.upload(filePath, { folder: 'pet_house_server/pets/pictuers/'+ req.header('uid')}, (error, result) => {
            if (error) {
              console.error(error);
              return res.status(500).json({ error: 'Something went wrong' });
            }
            urls.push({
              'webViewLink': result.url,
              'webContentLink': result.url,
             });
          });
        }
    }
    
    fields.tags = await JSON.parse(fields.tags); 
    fields.options = await JSON.parse(fields.options); 
    fields.diet = await JSON.parse(fields.diet); 
    //fields.seller = await JSON.parse(fields.seller);  
   
    const pet = new Pet({
      name: fields.name,
      breed: fields.breed,
      quantity:fields.quantity,
      ageInMonths: fields.ageInMonths,
      ageInYears:fields.ageInYears,
      gender: fields.gender,
      weight: fields.weight,
      color: fields.color,
      vaccinations:z,
      medicalHistory: fields.medicalHistory,
      microchipNumber: fields.microchipNumber,
      dateOfBirth: fields.dateOfBirth,
      adoptionDate:fields.adoptionDate,
      sterilized: fields.sterilized,
      image:urls,
      seller:{id: req.header('uid')},
      price:fields.price,
      description:fields.description,
      location:fields.location,
      status:fields.status,
      category:fields.category,
      viewCount:fields.viewCount,
      tags:fields.tags,
      options:fields.options,
      createdDate:fields.createdDate,
      updatedDate:fields.updatedDate,
      isFeatured:fields.isFeatured,
      isNew:fields.isNew,
      temperature: fields.temperature,
      ph: fields.ph,
      specificGravity : fields.specificGravity,
      diet: fields.diet,
      careLevel : fields.careLevel,
      waiting:true,
      hidden:false,
      reports:fields.reports
    });
  pet.save(async(err) => {
      if (err) {  
          return res.status(500).send(err)       
        }
        let seller = await User.findById(req.header('uid'));
        seller.myPets.push(pet._id.toString())
        await seller.save()
        return res.header('x-auth-token',req.header("x-auth-token")).send(pet);
      }
  );
  });
}
  catch(e){
    return res.status(500).send(e);
  } 
})

router.post('/create-report-item',middlewareAuth,async(req,res)=>{
  try {
   if(req.header('x-auth-token')==undefined || req.header('x-auth-token')=='' || 
   req.header('uid')==undefined || req.header('uid')=='' ){
   return res.status(401).send("ERROR : some data error, please enter correct data ! ");
   }
   let user = await User.findById(req.header('uid'));
   if(!user){
     return res.status(404).send("ERROR : this user not found ! ");
   }
    let pet = await Pet.findById(req.header('itemId'));
    pet.reports.push(req.header('uid'));
    pet.save(
      (err)  => {
        if (err) {  
            return res.status(500).send(err)       
          }
          return res.status(200).send({'message':'Reported successfully'})  
        }
    );
  }
   catch(e){
     return res.status(500).send({'message':e["message"]})   
   }
})

// ADMIN APIS ---------------------------------------------------------
router.post('/item-deletion-report',middlewareAuth,async(req,res)=>{
 try {
  if(req.header('x-auth-token')==undefined || req.header('x-auth-token')=='' || 
  req.header('uid')==undefined || req.header('uid')=='' ){
  return res.status(401).send("ERROR : some data error, please enter correct data ! ");
  }
  let user = await User.findById(req.header('uid'));
  if(!user){
    return res.status(404).send("ERROR : this user not found ! ");
  }
  if(!user.isAdmin){
    return res.status(404).send("ERROR : this user not Admin ! ");
  }
  const report = ItemDeletionReportModel(req);
  // new ItemDeletionReport({
  //   adminId: {id:req.header('uid')},
  //   itemId:{ id:req.body['itemId']},
  //   ownerId: {id:req.body['ownerId']},
  //   managerId: {id:''},
  //   content:  req.body['content'],
  //   deletedAt: '',
  //   deleted: false
  // });
   let pet = await Pet.findById(req.body['itemId']);
   pet.hidden = true;
   pet.waiting = false;
   report.save(
    (err)  => {
      if (err) {  
          return res.status(500).send(err)       
        }
        pet.save(
          (err)  => {
            if (err) {  
                return res.status(500).send(err)       
              }
              return res.status(200).send({'message':'Reported successfully'})  
            }
        );
      }
  );}
  catch(e){
    return res.status(500).send({'message':e["message"]})   
  }
})

router.get('/get-pets-reported',middlewareAuth,async(req,res)=>{
  try{
      if(req.header('x-auth-token')==undefined || req.header('x-auth-token')=='' || 
        req.header('uid')==undefined || req.header('uid')==''){
        return res.status(401).send("ERROR : some data error, please enter correct data ! ");
      }
      let user = await User.findById(req.header('uid'));
      if(!user){
        return res.status(404).send("ERROR : this user not found ! ");
      }
      if(!user.isAdmin){
        return res.status(404).send("ERROR : this user not Admin ! ");
      }
    let pets = (await Pet.find()).filter(e => e.reports[0] != undefined && e.hidden ==false);
    if(pets != [] ){
      for(var pet of pets){
        let seller = await User.findById(pet.seller.id);
        if(seller){
          pet.seller = userModel(seller)
        }
        if(pet.reports != []){
          var list = [];
          for(var id of pet.reports){
            let user = await User.findById(id);
            if(user){
              list.push(userModel(user));
              
            }
          }
          pet.reports = list;
        }
      }
    }
    return res.status(200).send(pets);
    }
  catch(e){
    return res.status(500).send({'message':e["message"]})   
  }
})

router.delete('/remove-pet-reports',middlewareAuth,async(req,res)=>{
 try {
  if(req.header('x-auth-token')==undefined || req.header('x-auth-token')=='' || 
    req.header('uid')==undefined || req.header('uid')=='' ||
    req.header('pid')==undefined || req.header('pid')==''){
    return res.status(401).send("ERROR : some data error, please enter correct data ! ");
  }
  let user = await User.findById(req.header('uid'));
  if(!user){
    return res.status(404).send("ERROR : this user not found ! ");
  }
  if(!user.isAdmin){
    return res.status(404).send("ERROR : this user not Admin ! ");
  }
 let pet = await Pet.findById(req.header('pid'));
 if(!pet){
  return res.status(404).send("ERROR : this item not found ! ");
}
 pet.reports = [];
 pet.hidden = false;
 pet.save(
  (err)  => {
    if (err) {  
        return res.status(500).send(err)       
      }
      return res.status(200).send({'message':'Remove Reports successfully'})  
    }
  );
}
catch(e){
  return res.status(500).send({'message':e["message"]})   
}
})

router.get('/get-waiting-pets',middlewareAuth,async(req,res)=>{
try{  
    if(req.header('x-auth-token')==undefined || req.header('x-auth-token')=='' || 
      req.header('uid')==undefined || req.header('uid')==''){
      return res.status(401).send("ERROR : some data error, please enter correct data ! ");
    }
    let user = await User.findById(req.header('uid'));
    if(!user){
      return res.status(404).send("ERROR : this user not found ! ");
    }
    if(!user.isAdmin){
      return res.status(404).send("ERROR : this user not Admin ! ");
    }
   let pets = (await Pet.find()).filter(e => e.waiting==true);
  return res.status(200).send(pets);}
  catch(e){
    return res.status(500).send({'message':e["message"]})   
  }
})

router.get('/publishing-waiting-pets',middlewareAuth,async(req,res)=>{
 try {
  if(req.header('x-auth-token')==undefined || req.header('x-auth-token')=='' || 
    req.header('uid')==undefined || req.header('uid')=='' || req.header('pid')==undefined || req.header('pid')==''){
    return res.status(401).send("ERROR : some data error, please enter correct data ! ");
  }
  let user = await User.findById(req.header('uid'));
  if(!user){
    return res.status(404).send("ERROR : this user not found ! ");
  }
  if(!user.isAdmin){
    return res.status(404).send("ERROR : this user not Admin ! ");
  }
  let pet = await Pet.findById(req.header('pid'));
  if(!pet){
    return res.status(404).send("ERROR : this pet not found ! ");
    }
  if(pet.hidden){
      return res.status(404).send("ERROR : this pet not found ! ");
    }
  pet.waiting = false;
  let publisher = await User.findById(pet.seller['id']);
  const report = publishingReportModel(req);
  //  new ActivityReport({
  //   adminId:req.header('uid'),
  //   content:'Publishing has been approved by the admin',
  //   title:'publishing',
  // });
  report.save( 
    async(err)  => {
      if (err) {  
          return res.status(500).send(err)       
        }
        publisher.reports.push(report._id.toString());
        await publisher.save();
        pet.save(
          (err) => {
            if (err) {  
                return res.status(500).send(err)       
              }
            return res.status(200).send(pet)
            }
        )
      }
  )}
  catch(e){
    return res.status(500).send({'message':e["message"]})   
  }
 
})
//--------------------------------------------------------------------------









router.post('/addPettt', (req,res) => {
try{      if(req.body.seller == undefined || req.body.seller == "" || req.body.seller == null || req.body.seller.id == undefined )return res.status(500).send("Seller Not Founded ! 0");
      if(req.body.image == undefined || req.body.image == "")return res.status(500).send("image Not Found !");
      if(req.body.diet == undefined || req.body.diet == [])return res.status(500).send("diet Not Found !");
        const pet = new Pet({
        name: req.body.name,
        breed:  req.body.breed,
        quantity:req.body.quantity,
        ageInYears:  req.body.ageInYears,
        ageInMonths:  req.body.ageInMonths,
        gender:  req.body.gender,
        weight:  req.body.weight,
        color:  req.body.color,
        vaccinations:  req.body.vaccinations,
        medicalHistory:  req.body.medicalHistory,
        microchipNumber:  req.body.microchipNumber,
        dateOfBirth:  req.body.dateOfBirth,
        adoptionDate: req.body.adoptionDate,
        sterilized:  req.body.sterilized,
        image: {
          webViewLink: req.body.image.webViewLink,
          webContentLink: req.body.image.webContentLink,},
        seller:  req.body.seller,
        price: req.body.price,
        description: req.body.description,
        location: req.body.location,
        status: req.body.status,
        category: req.body.category,
        viewCount: req.body.viewCount,
        tags: req.body.tags,
        options: req.body.options,
        createdDate: req.body.createdDate,
        updatedDate: req.body.updatedDate,
        isFeatured: req.body.isFeatured,
        temperature: req.body.temperature,
        ph: req.body.ph,
        specificGravity : req.body.specificGravity,
        diet: req.body.diet,
        careLevel : req.body.careLevel,
      });
      pet.save((err) => {
         if (err) {  
             return res.status(500).send(err)       
            }
            res.status(200).send(pet)
         }) }
         catch(e){
          return res.status(500).send({'message':e["message"]})   
        }
});

router.post('/addPet', (req,res) => {
try{  var form = new formidable.IncomingForm();
  form.parse(req,(err,fields,files)=>{
    if( fields.seller == undefined || fields.seller == "" || fields.seller == null || fields.seller.id == undefined )return res.status(500).send("Seller Not Founded ! 0");
    if(files.image == undefined || files.image == "")return res.status(500).send("image Not Found !");
    if(fields.diet == undefined || fields.diet == [])return res.status(500).send("diet Not Found !");
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
        const pet = new Pet({
        name: fields.name,
        breed: fields.breed,
        quantity:fields.quantity,
        age: fields.age,
        gender: fields.gender,
        weight: fields.weight,
        color: fields.color,
        vaccinations: fields.vaccinations,
        medicalHistory: fields.medicalHistory,
        microchipNumber: fields.microchipNumber,
        dateOfBirth: fields.dateOfBirth,
        adoptionDate:fields.adoptionDate,
        sterilized: fields.sterilized,
        image:{
          webViewLink:apiConsts.GOOGLE_DRIVE_IMAGE_URL + file.data.id,
          webContentLink: result.data.webContentLink
        },
        // result.data,
        seller: fields.seller,
        price:fields.price,
        description:fields.description,
        location:fields.location,
        status:fields.status,
        category:fields.category,
        viewCount:fields.viewCount,
        tags:fields.tags,
        options:fields.options,
        createdDate:fields.createdDate,
        updatedDate:fields.updatedDate,
        isFeatured:fields.isFeatured,
        isNew:fields.isNew,
        temperature: fields.temperature,
        ph: fields.ph,
        specificGravity : fields.specificGravity,
        diet: fields.diet,
        careLevel : fields.careLevel,
      });

      pet.save((err) => {
         if (err) {  
             oAuth2Client.setCredentials(null);  
             return res.status(500).send(err)       
            }
            res.status(200).send(pet)
         }) 
      });
        oAuth2Client.setCredentials(null);
    });
  });}
  catch(e){
    return res.status(500).send({'message':e["message"]})   
  }
});

function userModel(user){
  return {
    id:user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    picture: user.picture,
    address: user.address,
  }
}

function ItemDeletionReportModel(req){
  return new ItemDeletionReport({
    admin: {id:req.header('uid')},
    item:{ id:req.body['itemId']},
    owner: {id:req.body['ownerId']},
    manager: {id:''},
    content:  req.body['content'],
    deletedAt: '',
    deleted: false
  });
}

function publishingReportModel(req){
  return new ActivityReport({
    adminId:req.header('uid'),
    content:'Publishing has been approved by the administrator',
    title:'publishing',
  });
}

function deletionReportModel(req){
  return new ActivityReport({
    adminId:req.header('uid'),
    content:'Your post has been deleted by the administrator',
    title:'deletion',
  });
}

// router.get('/getAuthUrl', (req,res) => {
//     const authUrl = oAuth2Client.generateAuthUrl({
//       access_type:'offline',
//       scope:scope,
//     });
//     return res.send(authUrl);
// });


// router.post('/getToken', (req,res) => {
//   if(req.body.code == null){
//     return res.status(400).send('Invalid Requset !');
//   }
//   oAuth2Client.getToken(req.body.code,(err,token)=>{
//     if(err){
//       return res.status(400).send("Error Retrieving Access Token");
//     }
//     res.send(token);
//   });
 
// });

// router.post('/getUserInfo', (req,res) => {
//   if(req.body.token == null){
//     return res.status(400).send('Token Not Found !');
//   }
//   oAuth2Client.setCredentials(req.body.token);
//   const oAuth2 = google.oauth2({version:'v2',auth:oAuth2Client});
//   oAuth2.userinfo.get((err,response)=>{
//     if(err) res.status(400).send(err);
//     res.send(response.data);
//   });
 
// });

// router.post('/readDrive', (req,res) => {
//   if(req.body.token == null){
//     return res.status(400).send('Token Not Found !');
//   }
//   oAuth2Client.setCredentials(req.body.token);
//   const drive = google.drive({version:'v3',auth:oAuth2Client});
//   drive.files.list({
//     pageSize:10,
//   },(err,response)=>{
//     if(err) res.status(400).send(err);
//     const files = response.data.files;
//     if(files.length){
//       files.map((file)=>{
//         console.log(  file.name  );
//         console.log( file.id  );
//       }); 
//     }  else{
//       console.log("No File Found" );
//       }
//       res.send(files);
//   }
//   );
// });


// router.post('/downloadFileFromDrive/:id', async (req,res) => {
//   if(req.body.token == null)return res.status(400).send('Token Not Found !');
//   oAuth2Client.setCredentials(req.body.token);
//   const drive = google.drive({version:'v3',auth:oAuth2Client,});
//   var fileId = req.params.id;
//   drive.permissions.create({fileId:fileId,requestBody:{role:'reader',type:'anyone'}});
//   var result = await drive.files.get({fileId:fileId ,fields: 'webViewLink , webContentLink'}
  
//   //alt:"media",
//   //,{responseType:"stream",}
//   //  ,function(err,response){
//   //   console.log(response.data);
//   // response.data.on('end',()=> console.log("DONE "))
//   //   .on('error',err=>console.log("ERROR",err))
//   //   .pipe(res);
//   // }
//   );
//   return res.send(result.data);
// });

// router.post('/deleteFileFromDrive/:id', (req,res) => {
//   if(req.body.token == null)return res.status(400).send('Token Not Found !');
//   oAuth2Client.setCredentials(req.body.token);
//   const drive = google.drive({version:'v3',auth:oAuth2Client,});
//   var fileId = req.params.id;
//   drive.files.delete({'fileId':fileId}).then((response)=>{res.send(response.data);});
// });


 
// router.post('/uploadDrive', (req, res) => {
//   var form = new formidable.IncomingForm();
//   form.parse(req,(err,fields,files)=>{
//     if(err) res.status(400).send(err);
//     const token = JSON.parse(fields.token);
//     if(token == null)return res.status(400).send('Token Not Found !');
//     oAuth2Client.setCredentials( token);
//     const drive = google.drive({version:'v3',auth:oAuth2Client,});
//     const fileMetadata = {name:files.file.name,parents: ['1HrlhgRALxwmljWcI8xibd5e6EiivUdx7'],  };
//     const media = {mimeType:files.file.mimetype,body:fs.createReadStream(files.file.filepath)};
//     drive.files.create({resource:fileMetadata,media:media,fields:"id"},(err,file)=>{
//       drive.permissions.create({fileId:file.data.id,requestBody:{role:'reader',type:'anyone'}});
//       drive.files.get({fileId:file.data.id ,fields: 'webViewLink , webContentLink'},(err,result)=>{
//       oAuth2Client.setCredentials(null);
//       return res.status(200).send(result);
//       });
//     });
//   });
   
// })


  module.exports = router