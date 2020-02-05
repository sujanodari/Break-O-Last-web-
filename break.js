"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var registrationController = require("./controllers/registrationController.js");
var loginController = require("./controllers/loginController.js");
var hotelController = require("./controllers/hotelController.js");
var userDetail = require("./controllers/userDetail.js");
require("dotenv").config();
var app = express();
app.use(bodyParser.json('application/json'));
app.use(express.static(__dirname + "/public"));
var multer  = require("multer");
var storage = multer.diskStorage(
    {
        destination: "./public/profile/",
        filename: function ( req, file, cb ){
            let date_ob = new Date().valueOf();
            cb( null, date_ob+file.originalname);
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


app.post("/api/v1/users/signin",loginController.loginValidator,loginController.chkLogin,loginController.jwtTokenGen,loginController.login);

app.get("/api/v1/users/detail",userDetail.verifyToken,userDetail.getUser);

app.put("/api/v1/users/update/password",userDetail.verifyToken,userDetail.passwordValidation,registrationController.hashPassword,userDetail.updatePassword);

app.post('/api/v1/hotel/room',hotelController.roomValidation,hotelController.addHotel);

app.get('/api/v1/hotel/rooms',hotelController.getRooms);

app.post('/api/v1/hotel/room/book',userDetail.verifyToken,hotelController.getUserId,hotelController.bookValidation,hotelController.bookRoom);

app.get('/api/v1/hotel/rooms/book',userDetail.verifyToken,hotelController.getUserId,hotelController.getBook);

app.delete('/api/v1/hotel/rooms/book/delete/:id',userDetail.verifyToken,hotelController.deleteBook);

app.put("/api/v1/users/update/forget/password",userDetail.passwordValidation,registrationController.hashPassword,userDetail.forgetPassword);

app.delete('/api/v1/users/delete/user',userDetail.verifyToken,userDetail.deleteUser);

//error handling middleware first parm err
app.use(function(err,req,res,next){
    res.status(500);
    res.json({
    status:500,
    message:err.message
    });
  
    });







app.listen(process.env.APP_PORT);
