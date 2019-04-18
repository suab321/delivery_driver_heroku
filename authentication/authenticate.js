//module imports
const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const {temp,perma,Order}=require('../database/db');
const {local_link}=require('../urls/links');
const nodemailer=require('nodemailer');
const ejs=require('ejs');

//developer made function import
const token=require('../jwt/jwt');




//middleware to extract token from req headers
const get_token=(req,res,next)=>{
    const token=req.headers.authorization;
    if(token !== undefined){
        req.token=token.split(' ')[1];
        next();
    }
    else
        res.status(401).json({err:"0"});
}

const transporter= nodemailer.createTransport({
    service:"gmail",
    auth:{
    type:"OAuth2",
    user:"stowawaysuab123@gmail.com",
    clientId:"197901312379-he0vh5jq4r76if10ahv30ag8ged6f0in.apps.googleusercontent.com",
    clientSecret:"bdZnQ154LMlm-cNxsDVj0NF-",
    refreshToken:"1/XXO2jO_xcSG-TFTc3cToXvC5DlSVJr9mgqE4KroSbms"
    }
})

//verification link after registration
const verfiy=(email,token)=>{
    const mailoption={
        from:"stowawaysuab123@gmail.com",
        to:email,
        subject:"Delivery Verification",
        text:"Click the below link for verification",
        html:'<a href="https://fast-reef-53121.herokuapp.com/authentication/verification/'+token+'">'+token+'</a>'
    }

    transporter.sendMail(mailoption,(err,res)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(res);
        }
    })
}

//verification link sending for resetting password
const resetpass=(email,token)=>{
    const mailoption={
        from:'test29051571833@gmail.com',
        to:email,
        subject:"Deliver Reset password",
        text:"Click the link for restting password",
        html:'<a href="https://floating-brushlands-52313.herokuapp.com/authentication/reseting/'+token+'">'+token+'</a>'
    }

    transporter.sendMail(mailoption,(err,res)=>{
        if(err)
            console.log(err)
        else
            console.log(res)
    })
}



//registering user route
router.post('/register',(req,res)=>{
    perma.findOne({Email:req.body.Email}).then(user=>{
        if(user){
        res.status(200).json({response:"1"});
        }
        else{
        const db=new temp
        db.device_id=req.body.device_id
        db.Name=req.body.Name
        db.Password=req.body.Password
        db.MobileNo=req.body.MobileNo
        db.Email=req.body.Email
        db.IMEI=req.body.IMEI
        db.Flag=0
        db.Date=new Date()
        db.response="0"
        db.save().then(user=>{
            if(user){
                    const enc=token.generateToken(user.Email);
                    verfiy(user.Email,enc);
                    res.status(200).json({response:"0"});
            }
        }).catch(err=>{
        res.status(200).json({response:"1"});  
    })
        }
    }).catch(err=>{
        console.log(err);
        const db=new temp
        db.device_id=req.body.device_id
        db.Name=req.body.Name
        db.Password=req.body.Password
        db.MobileNo=req.body.MobileNo
        db.Email=req.body.Email
        db.IMEI=req.body.IMEI
        db.Flag=0
        db.Date=new Date()
        db.response="0"
        db.save().then(user=>{
            if(user){
                jwt.sign({user:user.Email},"suab",(err,token)=>{
                    verfiy(user.Email,token);
                    res.status(200).json({response:"0"});
                })
            }
        }).catch(err=>{
        res.status(200).json({response:"1"});  
    })
    })
})

//verifying when user clicks on link on gmail
router.get('/verification/:token',(req,res)=>{
        console.log("yes");
        const authdata=token.decodeToken(req.params.token);
        if(!authdata){
            res.status(401).json("Not authorised to acces this link");
        }
         perma.findOne({Email:authdata.user}).then(user=>{
            if(user)
                res.status(200).json({response:"1"})
            else{
                temp.findOneAndDelete({Email:authdata.user}).then(user=>{
                    const db=new perma
                    console.log("64"+user.IMEI)
                    db. device_id=user.device_id
                    db. Name=user.Name
                    db. Password=user.Password
                    db. MobileNo=user.MobileNo
                    db. Email=user.Email
                    db. IMEI=user.IMEI
                    db. Flag=user.Flag
                    db. Date=new Date()
                    db.response="1"
                    db. save().then(user=>{
                        res.render('verified',{name:user. D_Name});
                    })
                })
            }
        }).catch(err=>{res.status(200).json({response:"2"})})
})

//logging in user
router.post('/login',(req,res)=>{
    perma.findOne({Email:req.body.Email}).then(user=>{
        if(req.body.Password === user.Password)
            {
                perma.findById({_id:user.id},{Password:false}).then(user=>{
                    req.session.user=user._id;
                    const enct=token.generateToken(user._id);
                   res.status(200).json({key:enct,response:"1"});
                })
            }
        else
            res.status(400).json({response:"2"});
    }).catch(err=>{
    temp.findOne({Email:req.body.Email}).then(user=>{
        if(user){
            res.status(400).json({response:"3"})
        }
        else{
            res.status(400).json({response:"4"});
        }
    }).catch(err=>{
        res.status(400).json({response:"4"})
    })
})
})


//updating users profile
router.post('/update/:what/:value',get_token,(req,res)=>{
    const user_id=token.decodeToken(req.token).user;
    if(user_id){
        switch(req.params.what){
            case 1:
            perma.findByIdAndUpdate({_id:user_id},{Name:req.params.value},{new:true}).then(user=>{
                res.status(200).res({response:"1"});
            }).catch(err=>{
                res.status(400).json({response:"2"});
            })
                break;
            case 2:
            perma.findByIdAndUpdate({_id:user_id},{MobileNo:req.params.value},{new:true}).then(user=>{
                res.status(200).res({response:"1"});
            }).catch(err=>{
                res.status(400).json({response:"2"});
            })
                break;
        }
    }
})
//updating users profile ended



//reseting password email sending
router.get('/resetpass',get_token,(req,res)=>{
    //console.log(req.params.email);
    const user_id=token.decodeToken(req.token).user;
    if(user_id){
    perma.findOne({_id:user_id}).then(user=>{
        console.log(user)
        if(user){
            jwt.sign({user:user.Email},"suab",(err,token)=>{
                resetpass(user.Email,token);
                res.status(200).json({response:"1"});
            })
        }
        else{
            res.status(200).json({response:"4"});
        }
    }).catch(err=>{
        console.log(err);
        res.status(200).json({response:"4"});
    })
  }
  else
    res.status(401).json({err:"0"});
})


//link for new password req coming here from frontend ejs
router.post('/ressetingdone/:token',(req,res)=>{
    jwt.verify(req.params.token,"suab",(err,authdata)=>{
        perma.findOneAndUpdate({Email:authdata.user},{Password:req.body.password},{new:true}).then(user=>{
            res.status(200).json({msg:"Success"});
        }).catch(err=>{res.send(req.params.email)})
    })
})

//new password frontend after clicking on link on gmail
router.get('/reseting/:token',(req,res)=>{
    res.render('pass',{email:req.params.token})
})

//loggingOut from mongo session
router.get('/logout',(req,res)=>{
    if(req.session.user && req.cookies.user_sid){
        res.clearCookie('user_sid').json("LoggedOut");
    }
    else
        res.status(401).json("no session is pending!")
})

//getting_users data based on token recevied in request
router.get('/user_details',get_token,(req,res)=>{
    const user_id=token.decodeToken(req.token).user
    if(user_id){
        perma.findById({_id:user_id},{ Password:false}).then(user=>{
            if(user)
                res.status(200).json(user);
            else
                res.status(200).json({err:"1"});
        }).catch(err=>{
            res.status(400).json({err:"2"});
        })
    }
    else
        res.status(401).json({err:"3"});
})

//getting user's history
router.get('/order_history',get_token,(req,res)=>{
    const user_id=token.decodeToken(req.token).user;
    if(user_id){
        Order.find({User_id:user_id}).then(user=>{
            res.status(200).json(user);
        }).catch(err=>{console.log("261 err authenticate.js "+err)});
    }
    else
        res.status(401).json({err:"1"});
})
//getting order history ended//

//giivng driver list users_backend
router.get('/get_driver',(req,res)=>{
    perma.find({}).then(user=>{
        console.log(user)
        res.status(200).json(user)});
})


module.exports={
    auth_route:router
}