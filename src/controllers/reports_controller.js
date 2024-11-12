const {FeedbackReport} = require('../models/reports/feedback_report');
const { ObjectionReport } = require('../models/reports/objection_report');
const {User} = require('../models/users/user')

module.exports = {
    postFeedbackReports:async(req,res)=>{
     try{
        const report = new FeedbackReport({
        userId: req.user._id,
        content: req.body.content,
       });
       report.save((err) => {
        if (err) {  
            return res.status(500).send(err)       
           }
           res.status(200).send({'message':"added successfully"})
        })}
        catch(e){
         return res.status(500).send({'message':e["message"]})   
       }
    },
    getFeedbackReports:async(req,res)=>{
        try{
            if(!req.user.isAdmin){
              return res.status(500).send({'message':"This account not admin "})   
            }
            var reports = await FeedbackReport.find()
                .populate("userId","name picture email")
                .sort({date: -1});
                
                reports = await User.populate(reports,{
                    path:"userId",
                    select:"name picture email",
                });
           
           res.status(200).send(reports);
           }
            catch(e){
             return res.status(500).send({'message':e["message"]})   
           }
    },
    removeFeedbackReport:async(req,res)=>{
        try{
            if(!req.user.isManager){
              return res.status(500).send({'message':"This account not manager "})   
            }
            console.log(" report id " + req.body.rid)
            let report = await FeedbackReport.findByIdAndDelete(req.body.rid);
            if(!report){
                return res.status(404).send("Report Not Found");
              }
              return res.status(200).send({'message':"deleted successfully"});
           }
            catch(e){
             return res.status(500).send({'message':e["message"]})   
           }
    },
    checkObjectionReport:async(req,res)=>{
      try{
        //throw caches
        const email = await User.findOne({'email':req.body.email});
         if(!email){
          return res.status(500).send({'message':"There is no account for this email"}) 
         }
         const report = await ObjectionReport.findOne({'email':req.body.email});
         if(!report){
          return res.status(404).send({'message':"There is no report for this email"}) 
         }
         return res.status(200).send(report)       
      }
      catch(e){
          return res.status(500).send({'message':e["message"]})   
        }
    },    
    postObjectionReport:async(req,res)=>{
      try{
         const report = new ObjectionReport({
         email: req.body.email,
         content: req.body.content,
        });
        report.save((err) => {
         if (err) {  
             return res.status(500).send(err)       
            }
            res.status(200).send({
              'id':report.id.toString(),
              'message':"added successfully"})
         })}
         catch(e){
          return res.status(500).send({'message':e["message"]})   
        }
    },
    getObjectionReports:async(req,res)=>{
      try{
          if(!req.user.isAdmin){
            return res.status(500).send({'message':"This account not admin "})   
          }
          var reports = await ObjectionReport.find().sort({date: -1});
          return res.status(200).send(reports);
         }
          catch(e){
           return res.status(500).send({'message':e["message"]})   
         }
    },
    answerOnObjectionReport:async(req,res)=>{
      try{
        if(!req.user.isAdmin){
          return res.status(500).send({'message':"This account not admin "})   
        }
        
         let report = await ObjectionReport.findById(req.body.id)
         
         console.log(report)
         if(!report){
          return res.status(404).send({'message':"something wrong !!"})
         }
         report.answer=req.body.answer;
         report.responseDate = Date.now()
         
         report.save((err) => {
          if (err) {  
              return res.status(500).send(err)       
             }
             return res.status(200).send(report)
          })
        
      }
      catch(e){
        console.log(e)
        return res.status(500).send({'message':e["message"]})   
      }
    },
   
}