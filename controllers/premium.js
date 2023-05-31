const User = require('../models/User');
const Expense = require('../models/Expenses');
const sequelize = require('../util/database');
const getUserLeaderBoard=async (req,res)=>{
    try{
        const leaderboardofusers = await User.findAll({
            attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost'] ],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group:['user.id'],
            order:[['total_cost', 'DESC']]

        })
        res.status(200).json(leaderboardofusers);
    } catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

module.exports = {
    getUserLeaderBoard
}