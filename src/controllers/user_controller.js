const { User } = require("../models/users/user");
const { Pet } = require("../models/pet/pet");
const { ActivityReport } = require("../models/reports/activity_report");
const { ObjectionReport } = require('../models/reports/objection_report');

module.exports = {
    searchUsers:async(req,res)=>{
        try{
          if(!req.user.isManager){
            return res.status(500).send({'message':"this account not manager account"});
          }
          let items = (await User.find())
          .filter(e=> e.name.includes(req.params.text) && e.disabled == false && e.isManager == false);
          for(var item of items){
            var list = [];
            if(item.reports != []){
              for(var rid of item.reports){
                  let report = await ActivityReport.findById(rid);
                  list.push(report);
              } 
              item.reports = list;
              list=[];
            }
            if(item.myPets != []){
              for(var pid of item.myPets){
                  let pet = await Pet.findById(pid);
                  list.push(pet);
              } 
              item.myPets = list;
              list=[];
            }
            if(item.favourites != []){
              for(var pid of item.favourites){
                  let pet = await Pet.findById(pid);
                  list.push(pet);
              } 
              item.favourites = list;
              list=[];
            }
          }
         return res.status(200).send(items);
        }
        catch(err){
          return res.status(500).send({'message':err["message"]});
        }
      },

    changeUserStatus:async(req,res)=>{
      try{
        if(!req.user.isManager){
          return res.status(500).send({'message':"this account not manager account"});
        }
         
        let user = await User.findById(req.body.uid)
        if(!user){
          return res.status(404).send("ERROR : this user not found ! ");
        }
        if(user.isManager){
          return res.status(404).send("ERROR : this account is manager account ! ");
        }
        if(req.body.disabled == "true" && (req.body.whyDisabled == '' || req.body.whyDisabled == undefined)){
          return res.status(404).send("ERROR : you cannot disable any user without write why ! ");
        }
        if(req.body.disabled == "false" ) {
         await ObjectionReport.findOneAndDelete({email: user.email});
        }
         user.disabled = req.body.disabled
         user.isAdmin = req.body.isAdmin
         user.isManager = req.body.isManager
         user.disabledBy = user.disabled == true ? req.user._id : null
         user.whyDisabled = req.body.disabled == false ? "" : req.body.whyDisabled
         await user.save(
          (err) => {
            if (err) {  
                return res.status(500).send(err)       
              }
              return res.status(200).send({'message':"Change user status successfully"});
            }
        );
      }
      catch(err){
      return res.status(500).send({'message':err["message"]});
      }
    },   

    getClosedAccounts:async(req,res)=>{
      try{
        if(!req.user.isManager && !req.user.isAdmin){
          return res.status(500).send({'message':"this account not manager/admin account"});
        }
        let items = (await User.find())
        .filter(e=> e.disabled == true);
        for(var item of items){
          var list = [];
          let user = await User.findById(item.disabledBy);
          item.disabledBy = user;
          if(item.reports != []){
            for(var rid of item.reports){
                let report = await ActivityReport.findById(rid);
                list.push(report);
            } 
            item.reports = list;
            list=[];
          }
          if(item.myPets != []){
            for(var pid of item.myPets){
                let pet = await Pet.findById(pid);
                list.push(pet);
            } 
            item.myPets = list;
            list=[];
          }
          if(item.favourites != []){
            for(var pid of item.favourites){
                let pet = await Pet.findById(pid);
                list.push(pet);
            } 
            item.favourites = list;
            list=[];
          }
        }
       
       return res.status(200).send(items);
      }
      catch(err){
        return res.status(500).send({'message':err["message"]});
      }
    },    
}