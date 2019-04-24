const FCM=require('fcm-push');
const serverKey="AIzaSyCgJqVv7yZ97gcOoADX8uaCTFEeuiqbK2Y";

var fcm=new FCM(serverKey);

//importing user made modules//
const {user_server_link}=require('../urls/links')

//function to send notification to //
function notify_user(user){
    axios.get(`${user_server_link}/authentication/get_user`,{id:user.User_id}).then(res=>{
        var message={
            to:res.data[0].device_id,
            notification:{
                title:"Stowaway",
                body:`Your Order to ${user.Recevier_Name} has been started By ${user.Name}`
            }
        }
        fcm.send(menubar,(err,success)=>{
            if(err)
                console.log(err);
            else
                console.log(success);
        })
    })
}

module.exports={
    notify_user
}