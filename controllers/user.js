const User = require('../models/User');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

function isstringinvalid(string){
    if(string== undefined || string.length === 0){
        return true
    } else{
        return false 
    }
}

const signup = async (req,res,next)=>{
    try{
    const {name,email,password}=req.body;

    if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password) ){
        return res.status(400).json({err:"Bad parameters. Something is missing"})
    }

    const saltrounds=10;
    bcrypt.hash(password,saltrounds, async (err,hash)=>{
        const user=new User(
            {
                username:name,
                email:email,
                password:hash,
                ispremiumuser:false
            }) 

        await user.save();
        res.status(201).json({message:'Successfully created new user'});
    })    

    } catch(err){
        res.status(500).json(err)
    }
}

const generateAccessToken=(id,name,ispremiumuser)=>{
    return jwt.sign({userId:id,name:name,ispremiumuser:ispremiumuser},process.env.TOKEN_SECRET);
}

const login = async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(isstringinvalid(email) || isstringinvalid(password) ){
            return res.status(400).json({message:"Emailid or password is missing", success:false})
        }
        const user= await User.findOne({email:email});
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(err){
                    throw new Error('Something went wrong')
                }
                if(result === true){
                    res.status(200).json({success:true, message:"User logged in successfully",token:generateAccessToken(user._id,user.username,user.ispremiumuser)})
                } else{
                    res.status(400).json({success:false, message:"Password is incorrect"})
                } 
            })
            
        } else{
            res.status(404).json({success:false, message:"User does not exist"})
        }
    } catch(err){
        res.status(500).json({message:err,success:false})
    }
}

module.exports = {
    signup,
    login,
    generateAccessToken

}