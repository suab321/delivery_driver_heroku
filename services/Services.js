
//importing node modules
const router=require('express').Router();
const axios=require('axios');

//importing user made module
const {Order,perma}=require('../database/db');
const {generateToken,decodeToken}=require('../jwt/jwt');
const {user_server_link}=require('../urls/links')

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
                        axios.get(`${user_server_link}/authentication/order_status_update/${req.body.Order_id}/2`).then(resp1=>{
                            res.status(200).json({response:"0"});
                        }).catch(err=>{
                            res.status(400).json({response:"error updating your status",response:"0"});
                        })
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
                    Order.findOneAndUpdate({Order_id:req.body.Order_id},{CurrentStatus:3},{new:true}).then(user=>{
                        var x=order_complete(req.body.Order_id);
                        if(x)
                            res.status(200).json({response:"0"});
                        else
                            res.status(400).json({response:"There was an error upadting your order",response:"0"})
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


//function when the order completes//
const order_complete=(Order_id)=>{
    Order.find({Order_id:Order_id},{CurrentStatus:3},{new:true}).then(user=>{
        axios.get(`${user_server_link}/authentication/order_status_update/${Order_id}/3`,{order_id:Order_id}).then(resp=>{
            if(resp.status === 200 || 304)
                return user;
            else
                return 0;
            })
    }).catch(err=>{
        console.log(err);
        return 0;
    })
}
//ended function when order completes//

//route to delete the order when a user cancels a order//
router.get('/delete_order/:order_id',(req,res)=>{
    Order.findOneAndDelete({Order_id:req.params.order_id}).then(user=>{
        res.status(200).json({response:"1"});
    }).catch(err=>{
        res.status(400).json({response:"0"});
    })
})
//route to delete order ended//



//route to get the pending orders list//
router.get('/pending_order',get_token,(req,res)=>{
    const user_id=decodeToken(req.token).user;
    if(user_id){
        perma.findById({_id:user_id}).then(user=>{
            axios.get(`${user_server_link}/authentication/pending_order`).then(res1=>{
                res.status(200).json(res1.data);
            })
        }).catch(err=>{
            res.status(400).json({msg:"You are not valid user",response:"1"});
        })
    }
    else
        res.status(400).json({msg:"You are not authenticated to use this route",response:"2"});
})
//route to get the pending order list ended//

//route to get the all orders
router.get('/order',(req,res)=>{
    Order.find({}).then(user=>{
        res.status(200).json(user);
    })
})
//route ended///

module.exports={
   service_route:router
}