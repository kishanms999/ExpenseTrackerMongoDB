const Expense = require('../models/Expenses');

exports.insertExpense = async (req,res,next)=>{
    try{
        if(!req.body.expense){
            throw new Error('Enter an amount')
        }
    const expense=req.body.expense;
    const description=req.body.description;
    const category=req.body.category;

    const data = await Expense.create({amount: expense, description:description, category:category});
    res.status(201).json({newExpenseDetail:data});
    } catch(err){
        res.status(500).json({
            error:err
        })
    }
} 

exports.getExpenses = async (req,res,next)=>{
    try{
        const expenses=await Expense.findAll();
        res.status(200).json({allExpenses:expenses});
    } catch(error){
        console.log('Get expense is failing',JSON.stringify(error));
        res.status(500).json({error:error})
    }
}

exports.deleteExpense = async (req,res,next)=>{
    try{
        if(req.params.id=='undefined'){
            console.log('ID is missing');
            return res.status(400).json({err:'ID is missing'})
        }
        const eId=req.params.id;
        await Expense.destroy({where:{id:eId}});
        res.sendStatus(200);
    } catch(error){
        console.log(err);
        res.status(500).json(err);
    }
}

