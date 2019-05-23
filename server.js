//importing npm modules
const express=require('express');
const bodyparser=require('body-parser');
const app=express();
const session=require('express-session');
const mongoose=require('mongoose');
const MongoStore=require('connect-mongo')(session);
const cookieparser=require('cookie-parser');
const cron=require('node-cron');

//importing from developer made folder
const {auth_route}=require('./authentication/authenticate');
const {service_route}=require('./services/Services');
const {upload_route}=require('./photo_upload/photo_upload');
const sck=require('./sockets/socket_fucn');
const {mongourl}=require('./urls/links')


//mongoose connection
mongoose.connect(mongourl,{useNewUrlParser:true,useCreateIndex:true},(err,db)=>{
    if(err)
        console.log("server.js 15"+err);
})
//middlewares
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.set('view engine','ejs');
app.use(express.static('views'));
app.use(session({
    key:"user_sid",
    secret:"suab",
    resave:false,
    saveUninitialized:false,
    store:new MongoStore({
        mongooseConnection:mongoose.connection
    }),
    cookie:{maxAge:null}
}))
app.use(cookieparser());

//setting route name for import routes
app.use('/services',service_route);
app.use('/authentication',auth_route);
app.use('/photo',upload_route);

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/views/delivery.html');
})
cron.schedule('* * * * * *',()=>{
    console.log(Math.floor(Math.random()*10000+10000));
})

const port_connection=app.listen(process.env.PORT || 3003);
sck.connection(port_connection);

