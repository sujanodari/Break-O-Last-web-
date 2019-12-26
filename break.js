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
app.post('/api/v1/users/profile',upload.single("profileImage"),function(req,res){
    if(req.file === undefined|null){
        res.status(500);
        res.json({
        status:500,
        messsage:"Profile image cannot be empty"
            });
            
    }
    else{
        res.status(201);
        res.json({
        status:201,
        filename:req.file.filename
            });
    }
});
app.post('/api/v1/users/signup',registrationController.registrationValidation,registrationController.hashPassword,registrationController.registerUser);
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
