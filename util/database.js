const Sequelize=require('sequelize');
const sequelize=new Sequelize('expense','root','root123',{
    dialect:'mysql',
    host:'localhost'
});

module.exports=sequelize;