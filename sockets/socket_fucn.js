const socket=require('socket.io');


const {Order}=require('../database/db'); 


var io;
var connected_socket;

function connection(port){
    io=socket(port);
    io.on('connection',(socket)=>{
        connected_socket=socket
        console.log("made connection");
        //console.log(connected_socket);
        connected_socket.on("request",(data)=>{
            console.log("17 socket_func"+data.Name);
            var sender_unique=Math.floor(Math.random()*100000);
            var recevier_unique=Math.floor(Math.random()*100000);
            io.sockets.emit("request_accepted_driver",({data,sender_unique,recevier_unique}));
            const db=new Order
            db.User_id=data.User_id;
            db.Name=data.Name;
            db.Phone=data.Email;
            db.Driver_id=data._id
            db.Commodity=data.Commodity;
            db.Receving_Address=data.Receving_Address;
            db.Delivery_Address=data.Delivery_Address;
            db.Giver_Name=data.Giver_Name;
            db.Giver_Phone=data.Giver_Phone;
            db.Recevier_Phone=data.Recevier_Phone;
            db.Recevier_Name=data.Recevier_Name;
            db.Recevier_Email=data.Recevier_Email;
            db.Price=data.Price,
            db.Sender_Otp=sender_unique;
            db.Recevier_Otp=recevier_unique;
            db.Weight=data.Weight
            db.Date=new Date();
            db.save().then(user=>{
               console.log("40 func"+user);
            }).catch(err=>{console.log("38 socket_fucn"+err)});
        })
    })
}

module.exports={
    connection
}