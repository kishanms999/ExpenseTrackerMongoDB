const User = require('../models/User');

function isstringinvalid(string){
    if(string== undefined || string.length === 0){
        return true
    } else{
        return false 
    }
}

exports.signup = async (req,res,next)=>{
    try{
    const {name,email,password}=req.body;

    if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password) ){
        return res.status(400).json({err:"Bad parameters. Something is missing"})
    }

    const data = await User.create({name,email,password});
    res.status(201).json({message:'Successfully created new user'});
    } catch(err){
        res.status(500).json(err)
    }
}

exports.login = async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        if(isstringinvalid(email) || isstringinvalid(password) ){
            return res.status(400).json({message:"Emailid or password is missing", success:false})
        }
        const user = await User.findAll({where:{email}});
        if(user.length>0){
            if(user[0].password === password){
                res.status(200).json({success:true, message:"User logged in successfully"})
            } else{
                res.status(400).json({success:false, message:"Password is incorrect"})
            } 
        } else{
            res.status(404).json({success:false, message:"User does not exist"})
        }
    } catch(err){
        res.status(500).json({message:err,success:false})
    }
}