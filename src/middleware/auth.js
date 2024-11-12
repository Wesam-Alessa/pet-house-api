const jwt = require("jsonwebtoken");


module.exports = function (req,res,next) {
    const token = req.header("x-auth-token");
    if(!token){
       return res.status(401).send("access rejected...");
    }
   try{
       const decodeToken = jwt.verify(token,"privateKey");
        req.user = decodeToken;
        //console.log(req.user);
        next();
     
        // jwt.verify(token,"privateKey",async(err,user)=>{
        //     req.user = user;
        //     console.log(user);
        //     next();
        // })

   }
   catch(e){
       return res.status(400).send("Wrong token...");
   }
}