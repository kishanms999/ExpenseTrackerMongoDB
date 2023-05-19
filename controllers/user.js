const User = require('../models/User');

exports.insertUser = async (req,res,next)=>{
    try{
        if(!req.body.email){
            throw new Error('Email is mandatory')
        }
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;

    const data = await User.create({name: name, email:email, password:password});
    res.sendStatus(201);
    } catch(err){
        res.status(403).json({
            error:err
        })
    }
}