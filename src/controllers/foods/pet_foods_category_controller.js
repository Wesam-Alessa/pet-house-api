const cloudinary = require('cloudinary').v2;
const {PetFoodsCategory} = require('../../models/foods/pet_food_category');
const {User} = require('../../models/users/user');

module.exports = {
    add_pet_foods_category: async (req,res)=>{
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
        cloudinary.uploader.upload_stream({ folder: 'pet_house_server/foods/categories' }, (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Something went wrong' });
        } 
          const category = PetFoodsCategory({
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
      },

    update_pet_foods_category:async (req,res)=>{
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
      
        let category = await PetFoodsCategory.findById(req.header('cid'));
        if(!category){
          return res.status(404).send("ERROR : this category not found ! ");
        } 
      
        if(req.file != null) {
          cloudinary.uploader.upload_stream({ folder: 'pet_house_server/foods/categories' }, (error, result) => {
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
      
      },  

    get_pet_foods_categories:async (req,res)=>{
        if(req.header("x-auth-token") == undefined || req.header('uid') == undefined ||
          req.header("x-auth-token") == "" || req.header('uid') == "" ) {
          return res.status(401).send("ERROR : some data error, please enter correct data ! ");
        }   
        let user = await User.findById(req.header('uid'));
        if(!user){
        return res.status(404).send("ERROR : this user not found ! ");
        }
        let categories = await PetFoodsCategory.find();
        if(user.isAdmin == false){
        categories = categories.filter(item => item.hidden != true);
          return res.status(200).send(categories); 
        }
        else if(user.isAdmin == true) {
          return res.status(200).send(categories); 
        }
      }  
}