"use strict";
var express = require("express");
require("dotenv").config();
var app = express();


//error handling middleware first parm err
app.use(function(err,req,res,next){
    res.status(500);
    res.json({
    status:500,
    message:err.message
    });
  
    });



//for unnecessary request
    app.use("/*",function(req,res){
        res.status(404);
        res.json({
            status:404,
            message:"Page not found"
            });
    });
app.listen(process.env.APP_PORT);