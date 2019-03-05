const socket=require('socket.io');


const {user_server_link}=require('../urls/links');



function connection(port){
    var io=socket(port);

    io.on('connection',(socket)=>{
        console.log("made connection");
        socket.on("request",(data)=>{
            console.log(data);
            io.sockets.emit("request_accepted_driver",{data:"Request is accepted by the driver"});
        })
    })
}

module.exports={
    connection
}