const Expense = require('../models/Expenses');
const User = require('../models/User');
const DownloadedFiles = require('../models/downloadedfiles');
const { default: mongoose } = require('mongoose');
// const UserServices = require('../services/userservices');
const S3Services = require('../services/S3services');


function isstringinvalid(string){
    if(string== undefined || string.length === 0){
        return true
    } else{
        return false 
    }
}

exports.insertExpense = async (req,res,next)=>{
    const session= await mongoose.startSession();
    session.startTransaction();
    try{
        const {expenseamount,description,category}=req.body;
        if(isstringinvalid(expenseamount)||isstringinvalid(description)||isstringinvalid(category)){
            return res.status(400).json({err:"Bad parameters. Something is missing"})
        }

        const expense= new Expense({
            expenseamount:expenseamount,
            description:description,
            category:category,
            userId:req.user._id
        })
        await expense.save({session});
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);
        console.log(totalExpense);
        const user =await User.findOne({_id:req.user._id}).session(session);

        user.totalExpenses=totalExpense;
        await user.save({session});
        
        await session.commitTransaction();
        return res.status(201).json({expense,success:true});
    } catch(err){
        await session.abortTransaction();
        return res.status(500).json({success:false,error:err})
    } finally{
        session.endSession();
    }
} 

exports.getexpenses = async (req,res,next)=>{
    try{
        const page=+req.query.page||1;
        const limit=+req.query.limit||5;
        const total  = await Expense.count({userId:req.user._id});
        const expenses =await Expense.find({userId:req.user._id}).
            skip((page-1)*limit).
            limit(limit)
        return res.status(200).json({expenses,success:true,pagedata:{
            success:true,
            currentpage:page,
            nextpage:page+1,
            previouspage:page-1,
            hasnextpage:limit*page<total,
            haspreviouspage:page>1,
            lastpage:Math.ceil(total/limit),
        }});
    } catch(err){
        console.log('Get expense is failing',JSON.stringify(err));
        return res.status(500).json({error:err,success:false})
    }
}

exports.deleteExpense = async (req,res,next)=>{
    const session= await mongoose.startSession();
    session.startTransaction();
    try{
        const eId=req.params.id;
        const user= await Expense.findOne({userId:req.user._id,_id:eId})

        if(isstringinvalid(eId)){
            console.log('ID is missing');
            return res.status(400).json({success:false,message:'ID is missing'})
        }
        
        const response=await Expense.findByIdAndDelete({_id:eId},{session})
        if(response===0){
            return res.status(404).json({success:false,message:"Expense doesnt belong to the user"})
        }
        const totalExpense = Number(req.user.totalExpenses) - Number(user.expenseamount);
        await User.updateOne({_id:req.user._id},{totalExpenses:totalExpense},{session});
        await session.commitTransaction();
        return res.status(200).json({success:true,message:"Deleted Succesfully"});
    } catch(error){
        await session.abortTransaction();
        console.log(error);
        return res.status(500).json({success:false,message:"Failed"});
    } finally{
        session.endSession();
    }
}


exports.downloadexpense = async (req,res)=>{
    try{
        const premUser = req.user.ispremiumuser;
        if(premUser){
            const Expenses= await Expense.find({userId:req.user._id});
            const stringifiedExpenses = JSON.stringify(expenses);
            const userId = req.user.id;
            const filename= `Expense${userId}/${new Date()}.txt`;
            const fileUrl = await S3Services.uploadToS3(stringifiedExpenses,filename);
            const downloadfile=new  DownloadedFiles({url:fileURL,userId:req.user._id});
            await downloadfile.save();
            res.status(200).json({fileUrl, success:true})
        } else{
            res.status(401).json({fileUrl:'',success:false,message:'Not a premium user'})
        }
    } catch(err){
        console.log(err);
        res.status(500).json({fileUrl:'',success:false,err:err})
    }
}

exports.downloadedexpenses = async (req,res)=>{
    try{
        const downloadedfiles = await DownloadedFiles.find({userId:req.user._id}).limit(15);
        res.status(200).json({success:true,message:downloadedfiles});
    } catch(err){
        console.log(err);
        res.status(500).json({success:false,message:err})
    }
}

