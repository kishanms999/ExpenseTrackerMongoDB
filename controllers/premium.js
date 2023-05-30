const User = require('../models/User');
const Expense = require('../models/Expenses');
const sequelize = require('../util/database');
const getUserLeaderBoard=async (req,res)=>{
    try{
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggregatedExpenses={}
        expenses.forEach((expense) => {
            if(userAggregatedExpenses[expense.userId]){
                userAggregatedExpenses[expense.userId] += expense.expenseamount;
            } else{
                userAggregatedExpenses[expense.userId] = expense.expenseamount;
            }
        });
        var userLeaderBoardDetails=[];
        users.forEach((user) => {
            userLeaderBoardDetails.push({name:user.name,total_cost:userAggregatedExpenses[user.id] || 0})
        });
        console.log(userLeaderBoardDetails);
        userLeaderBoardDetails.sort((a,b)=>b.total_cost-a.total_cost)
        res.status(200).json(userLeaderBoardDetails);
    } catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

module.exports = {
    getUserLeaderBoard
}