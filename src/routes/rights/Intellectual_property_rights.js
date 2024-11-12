const express = require('express')
const router = express.Router();
const {rightsScheme} = require('../../models/rights/intellectual_property_rights');
const {User} = require('../../models/users/user');
const middlewareAuth = require("../../middleware/auth");

router.get('/get_intellectual_property_rights',middlewareAuth,async (req,res)=>{
    if(req.header("x-auth-token") == undefined ||  req.header("x-auth-token") == ""  ) {
      return res.status(401).send("ERROR : some data error, please enter correct data ! ");
    }   
    let rights = await rightsScheme.find();
    if(!rights){
     return res.status(200).send("ERROR : Intellectual property rights not found ! ");
    }
    return res.status(200).send(rights[0]); 
})

router.post('/update_intellectual_property_rights',middlewareAuth,async (req,res)=>{
    if(req.header("x-auth-token") == undefined || req.header('uid') == undefined ||
      req.header("x-auth-token") == "" || req.header('uid') == "" ) {
      return res.status(401).send("ERROR : some data error, please enter correct data ! ");
    }   
    let user = await User.findById(req.header('uid'));
    if(!user){
    return res.status(404).send("ERROR : this user not found ! ");
    }
    if(user.isAdmin == false){
     return res.status(404).send("ERROR : This user is not authorized to edit the content ! ");
    }
   
    let rights = await rightsScheme.findById(req.header("rid"));
    if(!rights){
     return res.status(200).send("ERROR : Intellectual property rights not found ! ");
    }
    rights.text = req.body['text'];
    rights.save((err) => {
        if (err) {  
            return res.status(500).send(err)       
        }
         return res.status(200).send(rights); 
    })  
})

module.exports = router