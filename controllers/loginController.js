        var user = require("../models/UserModel.js");
        const bcrypt = require("bcrypt");
        var jwt = require("jsonwebtoken");
        function loginValidator(req,res,next){
    
            if(req.body.phone===null){
                res.send("Phone Number cannot be null");
            }
            if(req.body.password===null){
                res.send("password cannot be null");
            }
            user.findOne({
                where:{phone:req.body.phone}
            })
            .then(function(result){
                if(result===null){
                    res.send("You have not registered, please register first");
                }
                else{
                    //console.log(result);
                    req.passwordFromDB=result.dataValues.password;
                    next();
                }
            }).catch(function(err){
                next(err);
            });
        }


        function chkLogin(req,res,next){
            if(req.passwordFromDB !==null){
                bcrypt.compare(req.body.password, req.passwordFromDB).then(function(res) {
                    next();  
                }).catch(function(err){
                    next("Hassing error");
                });  
            } else{
                res.end("User login Unsucessfull");
            }
        
        }

        function jwtTokenGen(req,res,next){
            var payloadd={
                username:req.body.phone,
                userlevel:"superadmin"
            }
        
        jwt.sign(payloadd,"thisIsSecreatKey",{expiresIn:"10h"},
        function(err,resultToken){
            req.token=resultToken;
            next();
        });
        }
        
        
      
        function login(req,res,next){
           // console.log(req.token);
            if(req.token !== null){
            res.json({
                status:202,
                usertoken:req.token});
            }
        }

        module.exports={loginValidator,
            chkLogin,jwtTokenGen,login};
        
