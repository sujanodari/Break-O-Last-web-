"use strict";
var express = require("express");
var registrationController = require("./controllers/registrationController.js");
require("dotenv").config();
var app = express();


//for unnecessary request
 //   app.use("/*",function(req,res){
   //     res.status(404);
   //     res.json({
   //         status:404,
     //       message:"Page not found"
     //       });
   // });
app.listen(process.env.APP_PORT);
