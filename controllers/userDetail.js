var user = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
function verifyToken(req,res,next){

}
function getUser(req,res,next){

}
//call registratiocontroller hash password
function updatePassword(req,res,next){
    req.hashedPassword=hash;

}
function phoneValidation(req,res,next){
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

function updatePhone(req,res,next){
   

}

function updateUserDetail(req,res,next){
    //phone is unique and password cannot be updated

}
module.exports={verifyToken,updatePhone,updatePassword,getUser,updateUserDetail,
    users,phoneValidation};

