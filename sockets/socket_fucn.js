const socket=require('socket.io');


const {perma_Order,temp_Order}=require('../database/db'); 


var io;
var connected_socket;

function connection(port){
    io=socket(port);
    io.on('connection',(socket)=>{
        connected_socket=socket
        console.log("made connection");
        //console.log(connected_socket);
        connected_socket.on("request",(data)=>{
            console.log("17 socket_func"+data);
            var sender_unique=Math.floor(Math.random()*100000);
            var recevier_unique=Math.floor(Math.random()*100000);
            io.sockets.emit("request_accepted_driver",({data,sender_unique,recevier_unique}));
            
            const db=new temp_Order
            db.User_id=data.User_id;
            db.Commodity=data.Commodity;
            db.Receving_Address=data.Receving_Address;
            db.Delivery_Address=data.Delivery_Address;
            db.Giver_Name=data.Giver_Name;
            db.Giver_Phone=data.Giver_Phone;
            db.Recevier_Phone=data.Recevier_Phone;
            db.Recevier_Name=data.Recevier_Name;
            db.Recevier_Email=data.Recevier_Email;
            db.Price=req.body.Price,
            db.Sender_Otp=sender_unique;
            db.Recevier_Otp=recevier_unique;
            db.Date=new Date();

            db.save().then(user=>{
                console.log("37 socket_fucn"+user);
            }).catch(err=>{console.log("38 socket_fucn"+err)});
        })
    })
}

module.exports={
    connection
}