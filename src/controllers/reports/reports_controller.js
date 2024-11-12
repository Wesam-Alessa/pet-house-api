const {ItemDeletionReport} = require('../../models/reports/item_deletion_report');
function ItemDeletionReportModel(req){
    return new ItemDeletionReport({
      admin: {id:req.header('uid')},
      item:{ id:req.body['itemId']},
      owner: {id:req.body['ownerId']},
      manager: {id:''},
      content:  req.body['content'],
      deletedAt: '',
      deleted: false,
      type: req.body['type'],
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
module.exports = {
    create_report_item:async (req,res,Obj,User)=>{
        try {
            if(req.header('x-auth-token')==undefined || req.header('x-auth-token')=='' || 
            req.header('uid')==undefined || req.header('uid')=='' ){
            return res.status(401).send({"message" : "some data error, please enter correct data ! "});
            }
            let user = await User.findById(req.header('uid'));
            if(!user){
              return res.status(404).send({"message" : "this user not found ! "});
            }
            let item = await Obj.findById(req.header('itemId'));
            if(!item){
                return res.status(404).send({"message" : "this item not found ! "});
            }
            else{
                if(item.reports != [] && item.reports.includes(req.header('uid'))){
                    return res.status(404).send({'message':'This user has already reported !'});
                }
                if(item.reports != [] && !item.reports.includes(req.header('uid'))){
                    item.reports.push(req.header('uid'));
                    item.save(
                        (err)  => {
                            if (err) {  
                                return res.status(500).send(err)       
                            }
                            return res.status(200).send({'message':'Reported successfully'})  
                            }
                        );
                } 
            } 
           }
            catch(e){
              return res.status(500).send({'message':e["message"]})   
            }
    },
    item_deletion_report:async (req,res,Obj,User)=>{
        try {
            if(req.header('x-auth-token')==undefined || req.header('x-auth-token')=='' || 
            req.header('uid')==undefined || req.header('uid')=='' ){
            return res.status(401).send({"message" : "some data error, please enter correct data ! "});
            }
            let user = await User.findById(req.header('uid'));
            if(!user){
              return res.status(404).send({"message" : "this user not found ! "});
            }
            if(!user.isAdmin){
              return res.status(404).send({"message" : "this user not Admin ! "});
            }
            const report = ItemDeletionReportModel(req);
             let item = await Obj.findById(req.body['itemId']);
             item.hidden = true;
             item.waiting = false;
             report.save(
              (err)  => {
                if (err) {  
                    return res.status(500).send({'message':err["message"]})       
                  }
                  item.save(
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
    },
    get_items_reported:async (req,res,Obj,User)=>{
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
          let items = (await Obj.find()).filter(e => e.reports[0] != undefined && e.hidden ==false);
          if(items != [] ){
            for(var item of items){
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
            }
          }
          return res.status(200).send(items);
          }
        catch(e){
          return res.status(500).send({'message':e["message"]})   
        }
    },
    remove_item_reports:async (req,res,Obj,User)=>{
        try {
            if(req.header('x-auth-token')==undefined || req.header('x-auth-token')=='' || 
              req.header('uid')==undefined || req.header('uid')=='' ||
              req.header('iid')==undefined || req.header('iid')==''){
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
            return res.status(404).send({"message" : "this item not found ! "});
          }
          item.reports = [];
          item.hidden = false;
          item.save(
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
    }
    
}