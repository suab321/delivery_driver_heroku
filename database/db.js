
//modules imports
const mongoose=require('mongoose');



const mongourl="mongodb://suab:Suab123@cluster0-shard-00-00-ynffd.mongodb.net:27017,cluster0-shard-00-01-ynffd.mongodb.net:27017,cluster0-shard-00-02-ynffd.mongodb.net:27017/delivery_driver?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
mongoose.connect(mongourl,{useNewUrlParser:true},(err,db)=>{
    if(err)
        console.log("db.js 11"+err);
    else
        console.log("database connected");
})

 

const Order_Schema=new mongoose.Schema({
    User_id:String,
    Driver_id:String,
    Commodity:String,
    Receving_Address:String,
    Delivery_Address:String,
    Giver_Name:String,
    Giver_Phone:String,
    Recevier_Phone:String,
    Recevier_Name:String,
    Recevier_Email:String,
    Price:String,
    CurrentStatus:{type:Number,default:1},
    Sender_Otp:String,
    Recevier_Otp:String,
    Date:String
})

const temp_schema=new mongoose.Schema({
    device_id:String,
    Name:String,
    Password:String,
    MobileNo:{type:String},
    Email:{type:String,unique:true},
    IMEI:{type:String},
    Flag:{type:Number,default:0},
    Date:{type:Date},
    response:{type:String},
})
const perma_schema=new mongoose.Schema({
    D_device_id:String,
    D_Name:String,
    D_Password:String,
    D_MobileNo:{type:String},
    D_Email:{type:String,unique:true},
    D_IMEI:{type:String},
    D_Flag:{type:Number,default:0},
    D_Date:{type:Date},
    D_response:{type:String},
    D_History:[{Order_id:String,CurrentStatus:{type:Number,default:0}}]
})

const temp_model=mongoose.model('temp',temp_schema);
const perma_model=mongoose.model('perma',perma_schema);
const Order=mongoose.model('Order',Order_Schema);

module.exports={
    temp:temp_model,
    perma:perma_model,
    Order,
    mongourl
}
