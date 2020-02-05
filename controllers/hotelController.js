var hotel = require("../models/HotelModel.js");
var user = require("../models/UserModel.js");
var jwt = require("jsonwebtoken");
//call userDetail.verifyToken


function roomValidation(req,res,next){  
    if(req.body.hotelName === null)
    {
        res.send("hotelName cannot be empty");
    }
    if(req.body.roomNo === null)
    {
        res.send("roomno cannot be empty");
    }
    if(req.body.description === null)
    {
        res.send("Description cannot be empty");
    }
    if(req.body.noOfBed === null)
    {
        res.send("noOfBed cannot be empty");
    }
    if(req.body.address === null)
    {
        res.send("address cannot be empty");
    }
    if(req.body.roomImage === null)
    {
        res.send("roomImage cannot be empty");
    }
    if(req.body.phone === null)
    {
        res.send("PhoneNumber cannot be empty");
    }
 
    hotel.hotel.findOne({
        where:{hotelName:req.body.hotelName,
            roomNo:req.body.roomNo}
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
                message:"Room already exist"
            });
        }
        
        })
        .catch(function(err){
            console.log(err);
        });

      }


    function addHotel(req,res,next){
        hotel.hotel.create({
            hotelName:req.body.hotelName,
            roomNo:req.body.roomNo,
            description:req.body.description,
            address:req.body.address,
            noOfBed:req.body.noOfBed,
            phone:req.body.phone,
            roomImage:req.body.roomImage
        })
        .then(function(result){
        res.status(201);
        res.json({
            code:201,
            status:"success",
            messsage:"Room is Added"
        });
        })
        .catch(function(err){
            next(err);
        });
        }
  

function getRooms(req,res,next){
hotel.hotel.findAll().then(function(result){
    if(result=== null){
        next(err);
    }
    else{
        res.status(200);
        res.json({
            data:result
        });
    }
    
    })
    .catch(function(err){
        console.log(err);
    });

}

function bookValidation(req,res,next){
    if(req.body.hotelId === null)
    {
        res.send("Hotel Id cannot be empty");
    }
    if(req.body.date === null)
    {
        res.send("Date Id cannot be empty");
    }
    
    hotel.booking.findOne({
        where:{userId:req.userID,
            hotelId:req.body.hotelId,
            Date:req.body.date
        }
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
                message:"Room already Booked"
            });
        }
        
        })
        .catch(function(err){
            console.log(err);
        });

      }

//call userDetail.verifyToken
function bookRoom(req,res,next){
    hotel.booking.create({
        userId:req.userID,
        hotelId:req.body.hotelId,
        Date:req.body.date
    })
    .then(function(result){
    res.status(201);
    res.json({
        code:201,
        status:"success",
        messsage:"Booking Success"
    });
    })
    .catch(function(err){
        next(err);
    });
    }

function getUserId(req,res,next){
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
            req.userID=result.dataValues.id;
            next();
        }
        
        })
        .catch(function(err){
            console.log(err);
        });
    }

function getBook(req,res,next){
hotel.booking.findAll({
    where:{userId:req.userID}
    }).then(function(result){
    if(result=== null){
        next(err);
    }
    else{
        res.status(200);
        res.json({
            data:result
        });
    }
    
    })
    .catch(function(err){
        console.log(err);
    });

}

function deleteBook(req,res,next){
    if(req.params.id === null)
    {
        res.send("room Id cannot be empty");
    }
    
    hotel.booking.destroy({
    where:{id:req.params.id}
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

module.exports={getRooms,roomValidation,addHotel,bookRoom,bookValidation,getBook,deleteBook,getUserId};

