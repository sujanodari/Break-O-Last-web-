var db = require ("../config/dbConfig.js");
var hotel=db.sequelize.define("Hotel",{
    //attributes
    id:{
        type:db.Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    hotelName:{
        type:db.Sequelize.TEXT,
        allowNull:false
    },
    roomNo:{
        type:db.Sequelize.INTEGER,
        allowNull:false
    },
    phone:{
        type:db.Sequelize.BIGINT,
        allowNull:false
    },
    description:{
        type:db.Sequelize.TEXT,
        allowNull:false
    },
    noOfBed:{
        type:db.Sequelize.INTEGER,
        allowNull:false
    },
    address:{
        type:db.Sequelize.TEXT,
        allowNull:false
    },
    roomImage:{
        type:db.Sequelize.TEXT,
        allowNull:true
    }
    
},{
    freezeTableName:true,
    tablesName:"Hotel"

});
hotel.sync({force:false})
.then(function(){

})
.catch(function(err){
    console.log(err);
});



var booking=db.sequelize.define("Book",{
    //attributes
    id:{
        type:db.Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    userId:{
        type:db.Sequelize.INTEGER,
        allowNull:false
    },
    hotelId:{
        type:db.Sequelize.INTEGER,
        allowNull:false
    },
    Date:{
        type:db.Sequelize.TEXT,
        allowNull:false
    }
},{
    freezeTableName:true,
    tablesName:"Book"

});
booking.sync({force:false})
.then(function(){

})
.catch(function(err){
    console.log(err);
});


module.exports={hotel,booking};