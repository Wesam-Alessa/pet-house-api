const {ActivityReport} = require('../../models/reports/activity_report');

function publishingReportModel(req){
    return new ActivityReport({
      adminId: req.header('uid'),
      content:'Publishing has been approved by the administrator',
      title:'publishing',
    });
  }

  module.exports = {
    get_waiting_items:async (req,res,Obj,User)=>{
        try{  
            if(req.header('x-auth-token')==undefined || req.header('x-auth-token')=='' || 
              req.header('uid')==undefined || req.header('uid')==''){
              return res.status(401).send({"message" : "some data error, please enter correct data ! "});
            }
            let user = await User.findById(req.header('uid'));
            if(!user){
              return res.status(404).send({"message" :" this user not found ! "});
            }
            if(!user.isAdmin){
              return res.status(404).send({"message" :"this user not Admin ! "});
            }
           let items = (await Obj.find()).filter(e => e.waiting==true);
          return res.status(200).send(items);}
          catch(e){
            return res.status(500).send({'message':e["message"]})   
          }
    },
    publishing_waiting_items:async (req,res,Obj,User)=>{
        try {
            if(req.header('x-auth-token')==undefined || req.header('x-auth-token')=='' || 
              req.header('uid')==undefined || req.header('uid')=='' || req.header('iid')==undefined || req.header('iid')==''){
              return res.status(401).send({"message" : "some data error, please enter correct data ! "});
            }
            let user = await User.findById(req.header('uid'));
            if(!user){
              return res.status(404).send({"message" : "this user not found ! "});
            }
            if(!user.isAdmin){
              return res.status(404).send({"message" : "this user not Admin ! "});
            }
            let item = await Obj.findById(req.header('iid'));
            if(!item){
              return res.status(404).send({"message": "this item not found ! "});
              }
            if(item.hidden){
                return res.status(404).send({"message" : "this item not found ! "});
              }
            item.waiting = false;
            let publisher = await User.findById(Obj.seller['id']);
            const report = publishingReportModel(req);
            report.save( 
              async(err) => {
                if (err) {  
                    return res.status(500).send(err)       
                  }
                  publisher.reports.push(report._id.toString());
                  await publisher.save();
                  item.save(
                    (err) => {
                      if (err) {  
                          return res.status(500).send(err)       
                        }
                      return res.status(200).send(item)
                      }
                  )
                }
            )}
            catch(e){
              return res.status(500).send({'message':e["message"]})   
            }
    },
  }