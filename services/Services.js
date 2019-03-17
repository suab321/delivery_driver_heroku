const router=require('express').Router();

//importing user made module
const {Order}=require('../database/db');
const {generateToken,decodeToken}=require('../jwt/jwt');

const get_token=(req,res,next)=>{
    if(req.headers.authorization !== undefined){
        const token=req.headers.authorization.split(' ')[1];
        req.token=token;
        next();
    }
    else
        res.status(401).json({err:"0"});
}


//checking sender otp
router.post('/check_sender_otp',get_token,(req,res)=>{
    const user_id=decodeToken(req.token).user;
    if(user_id){
        Order.find({Order_id:req.body.Order_id}).then(user=>{
            if(user){
                if(user.Sender_Otp === req.body.otp){
                    Order.find({Order_id:req.body.Order_id},{CurrentStatus:2}).then(user=>{
                        res.status(200).json({msg:"Senders Otp has match Successfully",err:"0"});
                    })
                }
                else
                    res.status(401).json({msg:"OTP did not match try again",err:"1"});
            }
        }).catch(err=>{
            console.log("31 Services.js "+err);
            res.status(400).json({msg:"We can evaluate your order",err:"2"});
        })
    }
    else
        res.status(401).json({err:"1"});
})


//checking receviers otp
router.post('/check_sender_otp',get_token,(req,res)=>{
    const user_id=decodeToken(req.token).user;
    if(user_id){
        Order.find({Order_id:req.body.Order_id}).then(user=>{
            if(user){
                if(user.Recevier_Otp === req.body.otp){
                    Order.find({Order_id:req.body.Order_id},{CurrentStatus:2}).then(user=>{
                        res.status(200).json({msg:"Recvier Otp has match Successfully",err:"0"});
                    })
                }
                else
                    res.status(401).json({msg:"OTP did not match try again",err:"1"});
            }
        }).catch(err=>{
            console.log("31 Services.js "+err);
            res.status(400).json({msg:"We cannot evaluate your order",err:"2"});
        })
    }
    else
        res.status(401).json({err:"1"});
})

module.exports={
   service_route:router
}