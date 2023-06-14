const Expense = require('../models/Expenses');
const User = require('../models/User');
const DownloadedFiles = require('../models/downloadedfiles');
const sequelize=require('../util/database');
const UserServices = require('../services/userservices');
const S3Services = require('../services/S3services');


function isstringinvalid(string){
    if(string== undefined || string.length === 0){
        return true
    } else{
        return false 
    }
}

exports.insertExpense = async (req,res,next)=>{
    const t= await sequelize.transaction();
    try{
        const {expenseamount,description,category}=req.body;
        if(isstringinvalid(expenseamount)||isstringinvalid(description)||isstringinvalid(category)){
            return res.status(400).json({err:"Bad parameters. Something is missing"})
        }

        const expense = await req.user.createExpense({expenseamount, description, category},{transaction:t}) // "or use" Expense.create({expenseamount, description, category,userId:req.user.id});
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);
        console.log(totalExpense);
        await User.update({
            totalExpenses:totalExpense
        },{
            where : {id:req.user.id},
            transaction:t
        })
        await t.commit();
        return res.status(201).json({expense,success:true});
    } catch(err){
        await t.rollback();
        return res.status(500).json({success:false,error:err})
    }
} 

exports.getexpenses = async (req,res,next)=>{
    try{
        const expenses=await req.user.getExpenses();   //"or use"req.user.getExpenses()  Expense.findAll({where:{userId:req.user.id}});
        return res.status(200).json({expenses,success:true});
    } catch(err){
        console.log('Get expense is failing',JSON.stringify(err));
        return res.status(500).json({error:err,success:false})
    }
}

exports.deleteExpense = async (req,res,next)=>{
    const t=await sequelize.transaction();
    try{
        const eId=req.params.id;
        const userExpense= await Expense.findOne({where:{id:eId}})

        if(isstringinvalid(eId)){
            console.log('ID is missing');
            return res.status(400).json({success:false,message:'ID is missing'})
        }
        
        const noofrows = await Expense.destroy({where:{id:eId,userId:req.user.id}});
        if(noofrows===0){
            return res.status(404).json({success:false,message:"Expense doesnt belong to the user"})
        }
        const totalExpense = Number(req.user.totalExpenses) - Number(userExpense.expenseamount);
        await User.update({
            totalExpenses:totalExpense
        },{
            where : {id:req.user.id},
            transaction:t
        })
        await t.commit();
        return res.status(200).json({success:true,message:"Deleted Succesfully"});
    } catch(error){
        await t.rollback();
        console.log(err);
        return res.status(500).json({success:false,message:"Failed"});
    }
}


exports.downloadexpense = async (req,res)=>{
    try{
        const premUser = req.user.ispremiumuser;
        if(premUser){
            const expenses = await UserServices.getExpenses(req);
            const stringifiedExpenses = JSON.stringify(expenses);
            const userId = req.user.id;
            const filename= `Expense${userId}/${new Date()}.txt`;
            const fileUrl = await S3Services.uploadToS3(stringifiedExpenses,filename);
            await DownloadedFiles.create({url:fileUrl,userId:userId});
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
        const downloadedfiles = await DownloadedFiles.findAll({where:{userId:req.user.id}});
        res.status(200).json({success:true,message:downloadedfiles});
    } catch(err){
        console.log(err);
        res.status(500).json({success:false,message:err})
    }
}

