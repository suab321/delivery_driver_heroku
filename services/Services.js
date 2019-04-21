
//importing node modules
const router=require('express').Router();
const axios=require('axios');

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
    console.log(req.body.otp);
    if(user_id){
        Order.find({Order_id:req.body.Order_id}).then(user=>{
            console.log(user)
            if(user){
                if(user[0].Sender_Otp === req.body.otp){
                    Order.findOneAndUpdate({Order_id:req.body.Order_id},{CurrentStatus:2},{new:true}).then(user=>{
                        res.status(200).json(user);
                    })
                }
                else
                    res.status(401).json({msg:"OTP did not match try again",response:"2"});
            }
        }).catch(err=>{
            console.log("31 Services.js "+err);
            res.status(400).json({msg:"We cant evaluate your order",err:"3"});
        })
    }
    else
        res.status(401).json({err:"4"});
})
//ended route checking sender otp//


//checking receviers otp
router.post('/check_recevier_otp',get_token,(req,res)=>{
    const user_id=decodeToken(req.token).user;
    if(user_id){
        Order.find({Order_id:req.body.Order_id}).then(user=>{
            if(user){
                if(user[0].Recevier_Otp === req.body.otp){
                    Order.findOneAndUpdate({Order_id:req.body.Order_id},{CurrentStatus:3}).then(user=>{
                        res.redirect('/order_complete');
                    })
                }
                else
                    res.status(401).json({msg:"OTP did not match try again",response:"2"});
            }
        }).catch(err=>{
            console.log("31 Services.js "+err);
            res.status(400).json({msg:"We cannot evaluate your order",response:"3"});
        })
    }
    else
        res.status(401).json({response:"4"});
})
//ended route checking recevier otp//


//route when the order completes//
router.post('/order_complete',(req,res,next)=>{

    Order.find({Order_id:req.body.Order_id},{CurrentStatus:3}).then(user=>{
        axios.post('https://floating-brushlands-52313.herokuapp.com/authentication/order_complete',{order_id:req.body.Order_id}).then(resp=>{
            if(resp.status === 200 || 304)
                res.status(200).json({msg:"Order Succcessfully Completed",err:"0"});
            else
                console.log(resp.data);
            })
    }).catch(err=>{
        res.status(400).err({msg:"There was some error with order completion",err:"1"});
    })
})
//ended route when order completes//

router.get('/delete_order/:order_id',(req,res)=>{
    Order.findOneAndDelete({Order_id:req.params.order_id}).then(user=>{
        res.status(200).json({response:"1"});
    }).catch(err=>{
        res.status(400).json({response:"0"});
    })
})

module.exports={
   service_route:router
}