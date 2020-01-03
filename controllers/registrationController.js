var user = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

function registrationValidation(req,res,next){
   
    if(req.body.username === null)
    {
        res.send("Username cannot be empty");
    }
    if(req.body.profileImage === null)
    {
        res.send("Image cannot be empty");
    }
    if(req.body.password === null)
    {
        res.send("Password cannot be empty");
    }
    if(req.body.gender === null)
    {
        res.send("Gender cannot be empty");
    }
    if(req.body.cPassword === null)
    {
        res.send("Please comform password");
    }
    if(req.body.cPassword !== req.body.password)
    {
        res.send("Password does not match");
    }
    if(req.body.address === null)
    {
        res.send("Address cannot be empty");
    }
    if(req.body.phone === null)
    {
        res.send("PhoneNumber cannot be empty");
    }
    if(req.body.email === null)
    {
        res.send("Email cannot be empty");
    }
    user.findOne({
    where:{phone:req.body.phone}
    })
    .then(function(result){
    if(result=== null){
        next();
    }
    else{
        res.status(409);
        res.json({
            code:409,
            status:"error",
            message:"User already exist"
        });
    }
    
    })
    .catch(function(err){
        console.log(err);
    });
    }
    
    function hashPassword(req,res,next){
        const saltRounds = 10;
        bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
            // Store hash in your password DB.
            req.hashedPassword=hash;
            next();
        }).catch(function(err){
            next("Hassing error");
        });
    }

    function registerUser(req,res,next){
        user.create({
            username:req.body.username,
            phone:req.body.phone,
            email:req.body.email,
            address:req.body.address,
            gender:req.body.gender,
            password:req.hashedPassword,
            profileImage:req.body.profileImage
        })
        .then(function(result){
        res.status(201);
        res.json({
            code:201,
            status:"success",
            messsage:"User is Registered"
        });
        })
        .catch(function(err){
            next(err);
        });
        }
        module.exports={registerUser,registrationValidation,hashPassword};