var user = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
function verifyToken(req,res,next){
    token=req.headers.authorization;
    if(token===null||undefined){
        res.json({status:400,message:'Token is not Provided'});
        return  res.status(400);
    }
    if (token.startsWith('Bearer ')) {
       // Remove Bearer from string
  token = token.slice(7, token.length).trimLeft();
} 
if (token) {
    jwt.verify(token,'thisIsSecreatKey',function(err,result){

        if (err) {
            res.status(403);
            res.json({
                code:403,
                status:"unauthorized",
                message: 'Token is not authorized'
              });
            res.status(403);
            
          } else {
            req.result = result;
            next();
          }    
    });
    
 } 
}
function getUser(req,res,next){
const usertoken = req.headers.authorization;
const token = usertoken.split(' ');
const decoded = jwt.verify(token[1], 'thisIsSecreatKey');
user.findOne({
    where:{phone:decoded.username}
    })
    .then(function(result){
    if(result=== null){
        next(err);
    }
    else{
        res.status(200);
        res.json({
            code:200,
            status:"success",
            username:result.dataValues.username,
            phone:result.dataValues.phone,
            address:result.dataValues.address,
            email:result.dataValues.email,
            gender:result.dataValues.gender,
            profileImage:result.dataValues.profileImage
        });
    }
    
    })
    .catch(function(err){
        console.log(err);
    });

}
//call registratiocontroller hash password
function updatePassword(req,res,next){
const usertoken = req.headers.authorization;
const token = usertoken.split(' ');
const decoded = jwt.verify(token[1], 'thisIsSecreatKey');

    user.update({
        password:req.hashedPassword
},{
    where:{
        phone:decoded.username
    }
},).then(function(result){
    if(result===0){
        res.status(404);
        res.json({
            code:404,
            status:"error",
            message: 'User not found'
          }); 
    }else
    {
        res.status(200);
        res.json({
            code:200,
            status:"success",
            message: 'User Updated'
          });
    }
}).catch(function(err){
    next(err);
});

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
function passwordValidation(req,res,next){
    if(req.body.password===null){
        res.send("password cannot be null");
    }
    next();
}
function updateUserDetail(req,res,next){
    //phone is unique and password cannot be updated

}
//call registratiocontroller hash password
function deleteUser(req,res,next){
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], 'thisIsSecreatKey');
    user.destroy({
        where:{phone:decoded.username}
        }).then(function(result){
        if(result=== null){
            next(err);
        }
        else{
            res.status(200);
            res.json({
                code:200,
                status:"success",
                data:result
            });
        }
        
        })
        .catch(function(err){
            console.log(err);
        });
    }
function forgetPassword(req,res,next){
        
    if(req.body.phone===null){
        res.send("phone number cannot be null");
    }
     user.update({
            password:req.hashedPassword
    },{
        where:{
            phone:req.body.phone
        }
    },).then(function(result){
        if(result===0){
            res.status(404);
            res.json({
                code:404,
                status:"error",
                message: 'User not found'
              }); 
        }else
        {
            res.status(200);
            res.json({
                code:200,
                status:"success",
                message: 'Password Updated'
              });
        }
    }).catch(function(err){
        next(err);
    });
    
    }


module.exports={forgetPassword,verifyToken,updatePhone,updatePassword,passwordValidation,getUser,updateUserDetail,phoneValidation,deleteUser};

