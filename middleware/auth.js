const jwt=require('jsonwebtoken');
const User=require('../models/User');

const authenticate= async (req,res,next)=>{
    try{
        const token=req.header('Authorization');
        console.log(token);
        const userdata= jwt.verify(token,process.env.TOKEN_SECRET);
        const user =  await  User.findById(userdata.userId);
        req.user=user;
        next();
    } catch(err){
        console.log(err);
        return res.status(401).json({success:false})
    }
}

module.exports={
    authenticate
}