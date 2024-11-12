const express = require('express')
const router = express.Router();
const {Pet} = require('../../models/pet/pet');
const {Tool} = require('../../models/tools/tool');
const {Food} = require('../../models/foods/pet_food');
const {User} = require('../../models/users/user');
const middlewareAuth = require("../../middleware/auth");
const {ActivityReport} = require('../../models/reports/activity_report');
const {ItemDeletionReport} = require('../../models/reports/item_deletion_report');
const reports_controller = require("../../controllers/reports/reports_controller");


router.get('/get-Item-deletion-reports',middlewareAuth,async(req,res)=>{
    try{
        if(req.header('x-auth-token')==undefined || req.header('x-auth-token')=='' || 
          req.header('uid')==undefined || req.header('uid')==''){
          return res.status(401).send("ERROR : some data error, please enter correct data ! ");
        }
        let user = await User.findById(req.header('uid'));
        if(!user){
          return res.status(404).send("ERROR : this user not found ! ");
        }
        if(!user.isManager){
          return res.status(404).send("ERROR : this user not Manager ! ");
        }
        let deletionReports = (await ItemDeletionReport.find()).filter(e=>e.deleted ==false);
        for(var report of deletionReports){
           let item ;
          switch(report.type) {
            case 'pet':
              item= await Pet.findById(report.item.id);
              break;
            case "tool":
              item = await Tool.findById(report.item.id);
              break;
            case "food":
              item = await Food.findById(report.item.id);
              break;  
            
          }
            let seller = await User.findById(item.seller.id);
            if(seller){
              item.seller = userModel(seller)
            }
            if(item.reports != []){
              var list = [];
              for(var id of item.reports){
                let user = await User.findById(id);
                if(user){
                  list.push(userModel(user));
                  
                }
              }
              item.reports = list;
            } 
            report.item = item;
            report.owner = await User.findById(report.owner.id);
            report.admin = await User.findById(report.admin.id);            
        }
       
        return res.status(200).send(deletionReports);
    }
    catch(e){
      return res.status(500).send({'message':e["message"]})   
    }
})

router.delete('/delete-Item-deletion-report',middlewareAuth,async(req,res)=>{
    try{
        if(req.header('x-auth-token')==undefined || req.header('x-auth-token')=='' || 
          req.header('uid')==undefined || req.header('uid')==''){
          return res.status(401).send("ERROR : some data error, please enter correct data ! ");
        }
        let user = await User.findById(req.header('uid'));
        if(!user){
          return res.status(404).send("ERROR : this user not found ! ");
        }
        if(!user.isManager){
          return res.status(404).send("ERROR : this user not Manager ! ");
        }
        let report = await ItemDeletionReport.findById(req.header('rid'));
        report.deleted = true;
        report.deletedAt = new Date();
        report.manager ={id:req.header('uid')};
        await report.save();
        let publisher = await User.findById(req.header('pid'));
        const activityReport = deletionReportModel(req);
        activityReport.save( 
          async(err)  => {
            if (err) {  
                return res.status(500).send(err)       
              }
              publisher.reports.push(activityReport.id.toString());
              await publisher.save();
              return res.status(200).send({'message':'deleted successfully'});
            }
        )
    }
    catch(e){
      return res.status(500).send({'message':e["message"]})   
    }
})

router.post('/item-deletion-report',middlewareAuth,async(req,res)=>{
  switch(req.body.type) {
    case 'pet':
      return reports_controller.item_deletion_report(req,res,Pet,User)
    case "tool":
      return reports_controller.item_deletion_report(req,res,Tool,User)
    case "food":
      return reports_controller.item_deletion_report(req,res,Food,User)
  }
})

function deletionReportModel(req){
    return new ActivityReport({
      adminId:req.header('uid'),
      content:'Your post has been deleted by the administrator',
      title:'deletion',
    });
}
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
  module.exports = router