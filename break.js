"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var registrationController = require("./controllers/registrationController.js");
var loginController = require("./controllers/loginController.js");
var hotelController = require("./controllers/hotelController.js");
var userDetail = require("./controllers/userDetail.js");
var cors = require("cors");
// const morgan=require("morgan");
require("dotenv").config();
var app = express();
app.use(cors());
// app.use(morgan("tiny"));
app.use(bodyParser.json('application/json'));
app.use(bodyParser.urlencoded({extended:true}));
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



var swaggerJSDoc=require('swagger-jsdoc');//actual for documentation
var swaggerUI=require('swagger-ui-express');//for viewing documentation

var swaggerDefinition={
info: {
    title:"Break-O-Last",
    version:"0.0.1",
    description:"This is Hotel Management System"
},
securityDefinitions: {
        bearerAuth: {
            type: "apiKey",
            name: "authorization",
            scheme: "bearer",
            in: "header"
        }
    },
host:'localhost:'+process.env.APP_PORT,
basePath:'/'

};

var swaggerOptions={
    swaggerDefinition,
    apis:["./break.js"]
};

var swaggerSpecs=swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUI.serve,swaggerUI.setup(swaggerSpecs));

app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecs);
  });

/**
 * @swagger
 * /api/v1/users/profile:
 *  post:
 *   tags:
 *    - UserImage
 *   description: Upload profilr image
 *   produces:
 *    - application/json
 *   consumes:
 *    - application/form-data
 *   parameters:
 *    - name: profileImage
 *      in: formData
 *      type: file
 *      required: true
 *      description: This is image to be upload
 *   responses:
 *    201:
 *     description: Upload successful
 *    500:
 *     description: Internal Error
 */

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

/**
 * @swagger
 * /api/v1/users/signup:
 *  post:
 *   summary: User Registration.
 *   tags:
 *    - User
 *   description: User Registration
 *   produces:
 *    - application/json
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: user
 *      description: The user to create.
 *      schema:
 *       type: object
 *       required:
 *        - username
 *        - password
 *        - cPassword
 *        - profileImage
 *        - gender
 *        - email
 *        - phone
 *        - address
 *       properties:
 *        username:
 *         type: string
 *        password:
 *         type: string
 *        cPassword:
 *         type: string
 *        phone:
 *         type: string
 *        address:
 *         type: string
 *        email:
 *         type: string
 *        gender:
 *         type: string
 *        profileImage:
 *         type: string
 *   responses:
 *    201:
 *     description: Registered successful
 *    409:
 *     description: Already registered
 *    500:
 *     description: Internal Error
 *    204:
 *     description: no-content
 */

app.post('/api/v1/users/signup',registrationController.registrationValidation,registrationController.hashPassword,registrationController.registerUser);

/**
 * @swagger
 * /api/v1/users/signin:
 *  post:
 *   summary: User Login.
 *   tags:
 *    - User
 *   consumes:
 *    - application/json
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: user
 *      description: The user to login.
 *      schema:
 *       type: object
 *       required:
 *        - phone
 *        - password
 *       properties:
 *        phone:
 *         type: string
 *        password:
 *         type: string
 *   responses:
 *    202:
 *     description: Login successfull
 *    409:
 *     description: Already registered
 *    500:
 *     description: Internal Error
 *    204:
 *     description: no-content
 */
app.post("/api/v1/users/signin",loginController.loginValidator,loginController.chkLogin,loginController.jwtTokenGen,loginController.login);

/**
 * @swagger
 * /api/v1/users/detail:
 *  get:
 *   tags:
 *    - UserDetail
 *   description: Get User Detail
 *   produces:
 *    - application/json
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: User detail fetch succesfully
 *    500:
 *     description: Internal Error
 *    404:
 *     description: User not found
 *    400:
 *     description: Token not provided
 *    403:
 *     description: unauthorized
 */
app.get("/api/v1/users/detail",userDetail.verifyToken,userDetail.getUser);


/**
 * @swagger
 * /api/v1/users/update/password:
 *  put:
 *   tags:
 *    - UpdatePassword
 *   description: Get User password updated
 *   produces:
 *    - application/json
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: user
 *      description: The user password to be updated.
 *      schema:
 *       type: object
 *       required:
 *        - password
 *       properties:
 *        password:
 *         type: string
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: User password updated succesfully
 *    500:
 *     description: Internal Error
 *    404:
 *     description: User not found
 *    400:
 *     description: Token not provided
 *    403:
 *     description: unauthorized
 */
app.put("/api/v1/users/update/password",userDetail.verifyToken,userDetail.passwordValidation,registrationController.hashPassword,userDetail.updatePassword);




/**
 * @swagger
 * /api/v1/hotel/room:
 *  post:
 *   summary: Hotel Addition.
 *   tags:
 *    - Hotel
 *   description: Hotel Addition
 *   produces:
 *    - application/json
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: hotel
 *      description: The hotel to be added.
 *      schema:
 *       type: object
 *       required:
 *        - hotelName
 *        - roomNo
 *        - description
 *        - address
 *        - noOfBed
 *        - phone
 *        - roomImage
 *       properties:
 *        hotelName:
 *         type: string
 *        roomNo:
 *         type: integer
 *        description:
 *         type: string
 *        phone:
 *         type: string
 *        address:
 *         type: string
 *        noOfBed:
 *         type: integer
 *        roomImage:
 *         type: string
 *   responses:
 *    201:
 *     description: Room is Added
 *    409:
 *     description: Already registered
 *    500:
 *     description: Internal Error
 *    204:
 *     description: no-content
 */
app.post('/api/v1/hotel/room',hotelController.roomValidation,hotelController.addHotel);


/**
 * @swagger
 * /api/v1/hotel/rooms:
 *  get:
 *   tags:
 *    - HotelRooms
 *   description: Get Rooms
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *     description: Rooms detail fetch succesfully
 *    500:
 *     description: Internal Error
 *    404:
 *     description: User not found
 *    400:
 *     description: Token not provided
 *    403:
 *     description: unauthorized
 */
app.get('/api/v1/hotel/rooms',hotelController.getRooms);


/**
 * @swagger
 * /api/v1/hotel/room/book:
 *  post:
 *   tags:
 *    - RoomBook
 *   description: Get Room Booked By User
 *   produces:
 *    - application/json
 *   consumes:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: room
 *      description: The Room to be booked.
 *      schema:
 *       type: object
 *       required:
 *        - hotelId
 *        - date
 *       properties:
 *        hotelId:
 *         type: string
 *        date:
 *         type: string
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    201:
 *     description: Room booked succesfully
 *    500:
 *     description: Internal Error
 *    404:
 *     description: User not found
 *    400:
 *     description: Token not provided
 *    403:
 *     description: unauthorized
 */
app.post('/api/v1/hotel/room/book',userDetail.verifyToken,hotelController.getUserId,hotelController.bookValidation,hotelController.bookRoom);



/**
 * @swagger
 * /api/v1/hotel/rooms/book:
 *  get:
 *   tags:
 *    - BookedRoom
 *   description: Get Booked Rooms
 *   produces:
 *    - application/json
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Booking detail fetch succesfully
 *    500:
 *     description: Internal Error
 *    404:
 *     description: User not found
 *    400:
 *     description: Token not provided
 *    403:
 *     description: unauthorized
 */
app.get('/api/v1/hotel/rooms/book',userDetail.verifyToken,hotelController.getUserId,hotelController.getBook);


/**
 * @swagger
 * /api/v1/hotel/rooms/book/delete/{id}:
 *  delete:
 *   tags:
 *    - DeleteBook
 *   description: Get Booked Room Delete By Booking Id
 *   produces:
 *    - application/json
 *   parameters:
 *    - name: id
 *      in: path
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: Booking deleted succesfully
 *    500:
 *     description: Internal Error
 *    404:
 *     description: User not found
 *    400:
 *     description: Token not provided
 *    403:
 *     description: unauthorized
 */
app.delete('/api/v1/hotel/rooms/book/delete/:id',userDetail.verifyToken,hotelController.deleteBook);


/**
 * @swagger
 * /api/v1/users/update/forget/password:
 *  put:
 *   summary: User Password Recover.
 *   tags:
 *    - RecoverUserPassword
 *   consumes:
 *    - application/json
 *   produces:
 *    - application/json
 *   parameters:
 *    - in: body
 *      name: user
 *      description: User recover Password using phone.
 *      schema:
 *       type: object
 *       required:
 *        - phone
 *        - password
 *       properties:
 *        phone:
 *         type: string
 *        password:
 *         type: string
 *   responses:
 *    200:
 *     description: Password update successfull
 *    409:
 *     description: Already registered
 *    500:
 *     description: Internal Error
 *    404:
 *     description: user not found
 */
app.put("/api/v1/users/update/forget/password",userDetail.passwordValidation,registrationController.hashPassword,userDetail.forgetPassword);



/**
 * @swagger
 * /api/v1/users/delete/user:
 *  delete:
 *   tags:
 *    - User
 *   description: Delete User
 *   produces:
 *    - application/json
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: User deleted succesfully
 *    500:
 *     description: Internal Error
 *    404:
 *     description: User not found
 *    400:
 *     description: Token not provided
 *    403:
 *     description: unauthorized
 */
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

module.exports = app
