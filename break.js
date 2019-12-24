"use strict";
var express = require("express");
var registrationController = require("./controllers/registrationController.js");
require("dotenv").config();
var app = express();


var multer  = require("multer");
var storage = multer.diskStorage(
    {
        destination: "./profile/",
        filename: function ( req, file, cb ){
            let date_ob = new Date().valueOf();
            cb( null, file.originalname+date_ob);
        }
    }
);
//multer is used to upload the file
var upload = multer( { storage: storage } );

app.post('/v1/register',upload.single("profileImage"),registrationController.registrationValidation,registrationController.hashPassword,registrationController.registerUser);


//error handling middleware first parm err
app.use(function(err,req,res,next){
    res.status(500);
    res.json({
    status:500,
    message:err.message
    });
  
    });
app.use(function(err,req,res,next){
    res.status(500);
    res.json({
    status:500,
    message:err.message
    });
  
    });

var multer  = require("multer");





app.listen(process.env.APP_PORT);
