const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const sequelize=require('./util/database');

var cors=require('cors');

const app = express();
const dotenv=require('dotenv');

app.use(cors());

dotenv.config();

const User = require('./models/User');
const Expense = require('./models/Expenses');
const Order = require('./models/Order');


const expenseRoutes=require('./routes/expense');
const userRoutes=require('./routes/user');
const purchaseRoutes=require('./routes/purchase');
const premiumRoutes=require('./routes/premium');
const passwordRoutes=require('./routes/password');


app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/purchase',purchaseRoutes);
app.use('/expense',expenseRoutes);
app.use('/user',userRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',passwordRoutes);


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync().then(result=>{
    app.listen(3000);
})
    
.catch(err=>{
    console.log(err);
})