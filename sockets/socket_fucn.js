const socket=require('socket.io');


const {perma_Order,temp_Order}=require('../database/db'); 


var io;
var connected_socket;
function connection(port){
    io=socket(port);

    io.on('connection',(socket)=>{
        connected_socket=socket
        console.log("made connection");
        console.log(connected_socket);
        connected_socket.on("request",(req)=>{
            io.sockets.emit("request_accepted_driver",{data:"Request is accepted by the driver"});
        })
    })
}

module.exports={
    connection
}