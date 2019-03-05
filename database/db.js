
//modules imports
const mongoose=require('mongoose');



const mongourl="mongodb://suab:Suab123@cluster0-shard-00-00-ynffd.mongodb.net:27017,cluster0-shard-00-01-ynffd.mongodb.net:27017,cluster0-shard-00-02-ynffd.mongodb.net:27017/delivery_driver?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
mongoose.connect(mongourl,{useNewUrlParser:true},(err,db)=>{
    if(err)
        console.log("db.js 11"+err);
    else
        console.log("database connected");
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
    device_id:String,
    Name:String,
    Password:String,
    MobileNo:{type:String},
    Email:{type:String,unique:true},
    IMEI:{type:String},
    Flag:{type:Number,default:0},
    Date:{type:Date},
    response:{type:String},
    History:[{Order_id:String}]
})

const temp_model=mongoose.model('temp',temp_schema);
const perma_model=mongoose.model('perma',perma_schema);

module.exports={
    temp:temp_model,
    perma:perma_model,
    mongourl
}
