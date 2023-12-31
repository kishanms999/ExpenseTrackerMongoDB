const User = require('../models/User');
const getUserLeaderBoard=async (req,res)=>{
    try{
        const leaderboardofusers=await User.find().sort({totalexpenses:-1}).limit(5)
        res.status(200).json(leaderboardofusers);
    } catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}

module.exports = {
    getUserLeaderBoard
}