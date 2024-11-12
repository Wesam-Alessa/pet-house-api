const cloudinary = require('cloudinary').v2;
const {Tool} = require('../../models/tools/tool');
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
    addPetTool: async(req,res)=>{
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
                await cloudinary.uploader.upload(filePath, { folder: 'pet_house_server/tools/items/'+ req.header('uid')}, (error, result) => {
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
            
            const tool = new Tool({
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
                reports:[]
            });

            tool.save(async(err) => {
                if (err) {  
                    console.log(err)
                    return res.status(500).send(err)       
                }
                let seller = await User.findById(req.header('uid'));
                seller.myPetTools.push(tool._id.toString())
                await seller.save()
                tool.seller = seller;
                
                return res.header('x-auth-token',req.header("x-auth-token")).send(tool);
                }
            );
            });
        }
            catch(e){
            return res.status(500).send({'message':e['message']});
            }
    },
    getPetTools:async(req,res)=>{
        try{
           
            let list = await Tool.find({category:req.params.category});
            let tools = list.filter(e => e.hidden == false && e.waiting == false);
            var newTools = [];
            if(!tools){
              return res.status(404).send({"message": "Tools not Found !!"});
            }
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
            return res.status(200).send(newTools);
            }  
            catch(e){
              return res.status(500).send({'message':e["message"]})   
            }
    },    
    getPetToolById:async(req,res)=>{
        const tool = await Tool.findById(req.params.id);
        if(!tool){
          return res.status(404).send("Tool Not Found");
        }
        if(tool.waiting == true || tool.hidden == true){
          return res.status(404).send("Tool Not Found");
        }
        if(tool.seller['id'] !="" && tool.seller['id'] != null && tool.seller['id'] != undefined){
           let user = await User.findById(tool.seller['id']);
             if(!user){
                return res.status(404).send("Tool Not Found");
              }
              tool.seller = userModel(user)
        }
        tool.reports = [];
        return res.status(200).send(tool);
    },
    searchPetTool:async(req,res)=>{
        try{
            let items = (await Tool.find()).filter(e=> e.name.includes(req.params.text) && e.hidden == false && e.waiting == false);
            //|| e.description.contains(req.params.text)==true&& e.hidden == false && e.waiting == false|| e.description.includes(req.params.text)
            var newTools = [];
            if(!items){
                return res.status(404).send({"message": "no items !!"});
            }
            for(var tool of items){
                tool.reports = [];
            if(tool.seller.id != ""){
                let user = await User.findById(tool.seller.id);
                if(user){
                    tool.seller = userModel(user)
                    newTools.push(tool)  
                }
            }
            }
        return res.status(200).send(newTools);
        }
            catch(e){
            return res.status(500).send({'message':e["message"]});
            }
    },
    removePetTool:async(req,res)=>{
        try{ 
            if(req.header("x-auth-token") == undefined || req.header("tid") == undefined || req.header("tid") == "") {
                return res.status(401).send({"message" : "some data error, please enter correct data ! "});
          }
          let tool = await Tool.findByIdAndDelete(req.header("tid"));
          if(!tool){
            return res.status(404).send("Tool Not Found");
          }
          return res.status(200).send("Deleted Successfully");}
          catch(e){
            return res.status(500).send({'message':e["message"]})   
          }
    }, 
    createReportTool:async(req,res)=>{
        await reports_controller.create_report_item(req,res,Tool,User);
    },  
    getReportedTools:async(req,res)=>{
        await reports_controller.get_items_reported(req,res,Tool,User);
    }, 
    removeToolReports:async(req,res)=>{
        await reports_controller.remove_item_reports(req,res,Tool,User);
    },
    getWaitingTools:async(req,res)=>{
        await waiting_controller.get_waiting_items(req,res,Tool,User);
    },   
    publishingWaitingTools :async(req,res)=>{
        await waiting_controller.publishing_waiting_items(req,res,Tool,User);
    },  
     
}