const { json } = require('express');
const apiConsts = require('../core/api_const') ;

async function SendNotification(data,callback){
    var headers = {
        "Content-Type" : "application/json; charset=utf-8",
        authorization: "Basic "+ apiConsts.ONE_SIGNAL_CONFIG.API_KEY,
    };

    var options = {
        host: "onesignal.com",
        port: 443,
        path:"/api/v1/notifications",
        method: "POST",
        headers: headers,
    };

    var https = require("https");
    var req = await https.request(options,function(res){
        
        res.on("data", function(data){
           // console.log(data);
            console.log(JSON.parse(data));

            return callback(null,JSON.parse(data))
        });
    });

    req.on("error", function(e){
        console.log(e);
        return callback({message: e});
    });
    console.log(JSON.stringify(data));
    req.write(JSON.stringify(data));
    req.end();
}

module.exports = {
    SendNotification
}