const express = require('express')
const router = express.Router();
const {User} = require('../../models/users/user');
const {Tool} = require('../../models/tools/tool');
const {Pet} = require('../../models/pet/pet');
const {Food} = require('../../models/foods/pet_food');
const middlewareAuth = require("../../middleware/auth");
const userController = require("../../controllers/user_controller");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const formidable= require('formidable');

// const multer = require('multer');
 const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
const apiConsts = require('../.././core/api_const') ;
const multer = require('multer');
const storage = multer.memoryStorage();
const uploads = multer({ storage });

// cloudinary.config({
//   cloud_name: apiConsts.CLOUDINARY_NAME,
//   api_key: apiConsts.CLOUDINARY_API_KEY,
//   api_secret: apiConsts.CLOUDINARY_API_SECRET
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'pet_house_server/users/profile/pictures',
//     allowed_formats: ['jpg', 'png', 'jpeg']
//   }
// });
// const uploads = multer({ storage:storage });


  router.get('/get-search-user-data/:text',middlewareAuth,userController.searchUsers);
  router.post('/change-user-status',middlewareAuth,userController.changeUserStatus);
  router.get('/get-closed-accounts',middlewareAuth,userController.getClosedAccounts);



  router.post('/update-user-profile-picture', uploads.single('picture'),async (req, res) => {
    try{ 
      if(req.header("x-auth-token") == undefined || req.body["uid"] == undefined ||
              req.header("x-auth-token") == "" || req.body["uid"] == "" ) {
        return res.status(401).send("ERROR : some data error, please enter correct data ! ");
    }   
    let user = await User.findById(req.body['uid']);
      if(!user){
        return res.status(404).send("ERROR : this user not found ! ");
      }
      cloudinary.uploader.upload_stream({ folder: 'pet_house_server/users/profile/pictures/' + req.body['uid'] },async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Something went wrong' });
        }
        user.picture = result.secure_url;
        await user.save(
          (err) => {
            if (err) {  
                return res.status(500).send(err)       
              }
              res.status(200).send(user)
            }
        );
      }).end(req.file.buffer);
    }
    catch(e){
      return res.status(500).send(e["message"]);
      }
  });

  router.get('/user-data',middlewareAuth,async (req, res) => {
    if(req.header("x-auth-token") == undefined || req.header("uid") == undefined ) {
        return res.status(401).send("ERROR : some data error, please enter correct data ! ");
    }
    let user = await User.findById(req.header('uid'))
    if(!user){
     return res.status(404).send("Error :This user not Found ");
   }
   if(user.disabled){
    return res.header('x-auth-token','').status(503).send("Error :Your account has been closed by the administration ");
   }
    const token = user.generateTokens();
    res.header('x-auth-token',token).send(_.pick(user,['_id','name','email','phone','address','picture','myPets','myPetFoods','myPetTools','favourites','isAdmin','isManager','reports']));
  });

  router.delete('/remove-favourite',middlewareAuth,async (req, res) => {
      if(req.header("x-auth-token") == undefined || req.body["uid"] == undefined || req.body["favID"] == undefined  || req.body["uid"] =='' || req.body["favID"] =='' || req.header("x-auth-token") == '') {
          return res.status(401).send("ERROR : some data error, please enter correct data ! ");
      }
      let user = await User.findById(req.body['uid']);
      if(!user){
      return res.status(404).send("Error :This user not Found ");
    }
      if(user.favourites.length === 0){
        return res.status(404).send("Error :This user not have any favourite items to delete it ...!");
      }
      user.favourites = user.favourites.filter(item => item.favID !== req.body["favID"]); 
      await user.save();
      const token = user.generateTokens();
      var fav = [];
      for(var item in user.favourites){
        var val;
        switch(user.favourites[item].type) {
          case 'pet':
            val =await Pet.findById(user.favourites[item].favID)
            break;
          case "tool":
            val =await Tool.findById(user.favourites[item].favID)
            break;
          case "food":
            val =await Food.findById(user.favourites[item].favID)
            break;
        }
        val.reports=[]
        fav.push({type:user.favourites[item].type,value:val})
      }
      res.header('x-auth-token',token).send(fav);
  });

  router.post('/add-favourite',middlewareAuth,async (req, res) => {
    if(req.header("x-auth-token") == undefined || req.body["uid"] == undefined || req.body["favID"] == undefined  || req.body["uid"] =='' || req.body["favID"] =='' || req.header("x-auth-token") == '') {
        return res.status(401).send("ERROR : some data error, please enter correct data ! ");
    }
    let user = await User.findById(req.body['uid']);
    if(!user){
     return res.status(404).send("Error :This user not Found ");
   }
   
    user.favourites.push({favID:req.body["favID"],type:req.body["type"]});
    await user.save(); 
    const token = user.generateTokens();
    res.header('x-auth-token',token).send(_.pick(user,['_id','name','email','phone','address','picture','myPets','myPetFoods','myPetTools','favourites','reports','isAdmin','isManager']));
  });

  router.get('/get_favourites',middlewareAuth,async (req, res) => {
    if(req.header("x-auth-token") == undefined || req.header("uid") == undefined ) {
        return res.status(401).send("ERROR : some data error, please enter correct data ! ");
    }
    let user = await User.findById(req.header('uid'))
    if(!user){
     return res.status(404).send("Error :This user not Found ");
   }
   if(user.disabled){
    return res.header('x-auth-token','').status(503).send("Error :Your account has been closed by the administration ");
   }
   var fav = [];
    for(var item in user.favourites){
      var val;
      switch(user.favourites[item].type) {
        case 'pet':
           val =await Pet.findById(user.favourites[item].favID)
           break;
        case "tool":
          val =await Tool.findById(user.favourites[item].favID)
           break;
        case "food":
           val =await Food.findById(user.favourites[item].favID)
          break;
      }
      val.reports=[]
      fav.push({type:user.favourites[item].type,value:val})
    }
    const token = user.generateTokens();
    res.header('x-auth-token',token).status(200).send( fav );
  });

  router.delete('/remove-my-item',middlewareAuth,async (req, res) => {
    if(req.header("x-auth-token") == undefined || req.body["uid"] == undefined || req.body["pid"] == undefined) {
        return res.status(401).send("ERROR : some data error, please enter correct data ! ");
    }
    let user = await User.findById(req.body['uid']);
    if(!user){
     return res.status(404).send("Error :This user not Found ");
    }
    let item;
    switch(req.body['type']){
      case  'pet':
         item = await Pet.findById(req.body['pid']);
         user.myPets = user.myPets.filter(item => item !== req.body["pid"]);
         item.hidden = true;
         await item.save(); 
        break;
      case  'tool':
         item = await Tool.findById(req.body['pid']);
         user.myPetTools = user.myPetTools.filter(item => item !== req.body["pid"]);
         item.hidden = true;
         await item.save(); 
        break;  
      case 'food':
        item = await Food.findById(req.body['pid']);
        user.myPetFoods = user.myPetFoods.filter(item => item !== req.body["pid"]);
        item.hidden = true;
        await item.save(); 
        break;  
    }
    await user.save(); 
    //await item.save(); 
    const token = user.generateTokens();
    return res.header('x-auth-token',token).send(_.pick(user,['_id','name','email','phone','address','picture','myPets','myPetFoods','myPetTools','favourites','reports','isAdmin','isManager']));
  });

  router.post('/update-user-data',middlewareAuth,async(req, res) => {
  try{   
      var form = new formidable.IncomingForm();
      form.parse(req,async(err,fields,files)=>{
        console.log(1);
        if(
          fields.uid == '' ||
          fields.name == '' ||
          fields.email == '' ||
          fields.phone == '' ||
          fields.address == '' ||
          fields.password == '' 
          ) {
              return res.status(401).send("ERROR : some data error, please enter correct data ! ");
          }
      let user = await User.findById(fields.uid);
      if(!user){
      return res.status(404).send("Error :This user not Found ");
    }
      user.name = fields.name;
      user.email = fields.email;
      user.phone = fields.phone;
      user.address = fields.address;
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds) ;
      user.password = await bcrypt.hash(fields.password,salt);
      if(files['file'] != undefined && files['file'].originalFilename != "" && files['file'].originalFilename !=null){
        const filePath = files['file'].filepath;
        cloudinary.uploader.upload(filePath, { folder: 'pet_house_server/users/profile/pictures/'+fields.uid  },async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Something went wrong' });
        }
        user.picture = result.url;
        await user.save(
          (err) => {
            if (err) {  
                return res.status(500).send(err)       
              }
              const token = user.generateTokens();
                res.header('x-auth-token',token).send(_.pick(user,['_id','name','email','phone','address','picture','myPets','myPetFoods','myPetTools','reports','favourites','isAdmin','isManager']));
            }
        );
      })
      }
      else {
        await user.save(
          (err) => {
            if (err) {  
                return res.status(500).send(err)       
              }
              const token = user.generateTokens();
              return res.header('x-auth-token',token).send(_.pick(user,['_id','name','email','phone','address','picture','myPets','myPetFoods','myPetTools','reports','favourites','isAdmin','isManager']));
            }
        ); 
      }

      });


    //   let user = await User.findById(req.body['uid']);
    //   if(!user){
    //    return res.status(404).send("Error :This user not Found ");
    //  }
    //   user.name = req.body['name'];
    //   user.email = req.body['email'];
    //   user.phone = req.body['phone'];
    //   user.address = req.body['address'];
    //   const saltRounds = 10;
    //   const salt = await bcrypt.genSalt(saltRounds) ;
    //   user.password = await bcrypt.hash(req.body['password'],salt);
    //   if(req.file){
    //     cloudinary.uploader.upload_stream({ folder: 'pet_house_server/users/profile/pictures/' + req.body['uid'] },async (error, result) => {
    //     if (error) {
    //       console.error(error);
    //       return res.status(500).json({ error: 'Something went wrong' });
    //     }
    //     user.picture = result.url;
    //     await user.save(
    //       (err) => {
    //         if (err) {  
    //             return res.status(500).send(err)       
    //           }
    //           const token = user.generateTokens();
    //             res.header('x-auth-token',token).send(_.pick(user,['_id','name','email','phone','address','picture','myPets','favourites']));
    //         }
    //     );

    //   }).end(req.file.buffer);
    //   }
    //   else {
    //     await user.save(
    //       (err) => {
    //         if (err) {  
    //             return res.status(500).send(err)       
    //           }
    //           const token = user.generateTokens();
    //           return res.header('x-auth-token',token).send(_.pick(user,['_id','name','email','phone','address','picture','myPets','favourites']));
    //         }
    //     ); 
    //   }
        
  }
  catch(e){
    return res.status(500).send(e["message"]);
   }
  });

  module.exports = router

