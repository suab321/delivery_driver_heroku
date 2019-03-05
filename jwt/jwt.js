const jwt=require('jsonwebtoken');


module.exports={
    generateToken,
    decodeToken
}



function generateToken(data){
    try{
  const token=jwt.sign({user:data},"suab");
    return token;
    }catch{
        return 0;
    }
}

function decodeToken(token){
    try{
        const authdata=jwt.verify(token,"suab");
        return authdata;
    } catch(err){
        return 0;
    }
}