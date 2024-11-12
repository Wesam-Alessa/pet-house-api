const cloudinary = require('cloudinary').v2;
const {Food} = require('../../models/foods/pet_food');
const {User} = require('../../models/users/user');
const formidable= require('formidable');
const reports_controller = require("../reports/reports_controller");
const waiting_controller = require("../waiting_items/waiting_controller");

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

module.exports = {
    addPetFood: async(req,res)=>{
        try{ 
            var form = new formidable.IncomingForm();
            form.parse(req,async(err,fields,files)=>{ 
            if(fields.seller == "" ||  fields.seller == null )return res.status(500).send({'message':"Seller Not Founded !"});
            if(form['openedFiles'] == "" || form['openedFiles'] == []||form['openedFiles'] == undefined)return res.status(500).send({'message':"image Not Found !"});
            if(err) return res.status(400).send(err);
            
            const list = Object.entries(form['openedFiles']).map(([key, value]) => ({ key, value }));
            var urls = [];
            for(const i of list){
                if(i.value['originalFilename'] != '' && i.value['originalFilename'] != null){
                    const filePath = i.value['filepath'];
                await cloudinary.uploader.upload(filePath, { folder: 'pet_house_server/foods/items/'+ req.header('uid')}, (error, result) => {
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
            
            const food = new Food({
                name: fields.name,
                quantity:fields.quantity,
                color: fields.color,
                image:urls,
                seller:{id: req.header('uid')},
                price:fields.price,
                description:fields.description,
                location:fields.location,
                status:fields.status,
                category:fields.category,
                viewCount:fields.viewCount,
                createdDate:fields.createdDate,
                updatedDate:fields.updatedDate,
                isFeatured:fields.isFeatured,
                waiting:true,
                hidden:false,
                reports:fields.reports
            });
            food.save(async(err) => {
                if (err) {  
                    return res.status(500).send(err)       
                }
                let seller = await User.findById(req.header('uid'));
                seller.myPetFoods.push(food._id.toString())
                await seller.save()
                food.seller = seller;
                return res.header('x-auth-token',req.header("x-auth-token")).send(food);
                }
            );
            });
        }
            catch(e){
            return res.status(500).send({'message':e['message']});
            }
    },
    getPetFoods:async(req,res)=>{
        try{
            let foods = (await Food.find()).filter(e => e.hidden == false && e.waiting == false);
            var newfoods = [];
            if(!foods){
              return res.status(404).send({"message": "food not Found !!"});
            }
            for(var food of foods){
                food.reports = [];
              if(food.seller.id != ""){
                let user = await User.findById(food.seller.id);
                if(user){
                    food.seller = userModel(user)
                    newfoods.push(tool)  
                }
              }
           }
            
            return res.status(200).send(newfoods);
            }  
            catch(e){
              return res.status(500).send({'message':e["message"]})   
            }
    },    
    getPetFoodById:async(req,res)=>{
        const food = await Food.findById(req.params.id);
        if(!food){
          return res.status(404).send("Food Not Found");
        }
        if(food.waiting == true || food.hidden == true){
          return res.status(404).send("Food Not Found");
        }
        if(food.seller['id'] !="" && food.seller['id'] != null && food.seller['id'] != undefined){
           let user = await User.findById(food.seller['id']);
             if(!user){
                return res.status(404).send("Food Not Found");
              }
              food.seller = userModel(user)
        }
        tool.reports = [];
        return res.status(200).send(food);
    },
    searchPetFood:async(req,res)=>{
        try{
            let items = (await Food.find()).filter(e=> e.name.includes(req.params.text) && e.hidden == false && e.waiting == false);
            //|| e.description.contains(req.params.text)==true&& e.hidden == false && e.waiting == false|| e.description.includes(req.params.text)
            var newFoods = [];
            if(!items){
                return res.status(404).send({"message": "no items !!"});
            }
            for(var food of items){
                food.reports = [];
            if(food.seller.id != ""){
                let user = await User.findById(food.seller.id);
                if(user){
                    food.seller = userModel(user)
                    newFoods.push(food)  
                }
            }
            }
        return res.status(200).send(newFoods);
        }
            catch(e){
            return res.status(500).send({'message':e["message"]});
            }
    },
    removePetFood:async(req,res)=>{
        try{ 
            if(req.header("x-auth-token") == undefined || req.header("fid") == undefined || req.header("fid") == "") {
                return res.status(401).send({"message" : "some data error, please enter correct data ! "});
          }
          let food = await Food.findByIdAndDelete(req.header("fid"));
          if(!food){
            return res.status(404).send("Food Not Found");
          }
          return res.status(200).send("Deleted Successfully");}
          catch(e){
            return res.status(500).send({'message':e["message"]})   
          }
    }, 
    createReportFood:async(req,res)=>{
        await reports_controller.create_report_item(req,res,Food,User);
    },  
    getReportedFoods:async(req,res)=>{
        await reports_controller.get_items_reported(req,res,Food,User);
    }, 
    removeFoodReports:async(req,res)=>{
        await reports_controller.remove_item_reports(req,res,Food,User);
    },
    getWaitingFoods:async(req,res)=>{
        await waiting_controller.get_waiting_items(req,res,Food,User);
    },   
    publishingWaitingFoods :async(req,res)=>{
        await waiting_controller.publishing_waiting_items(req,res,Food,User);
    },   
}

