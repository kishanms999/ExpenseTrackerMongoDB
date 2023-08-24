const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const fs=require('fs');

const app = express();
const dotenv=require('dotenv');

dotenv.config();

var cors=require('cors');
// var helmet=require('helmet');
// var morgan=require('morgan');

// const accessLogStream=fs.createWriteStream(
//     path.join(__dirname,'access.log'),
//     {flags:'a'}
//     );

app.use(cors());
// app.use(helmet());
// app.use(morgan('combined',{stream:accessLogStream}));

const User = require('./models/User');
const Expense = require('./models/Expenses');
const Order = require('./models/Order');
const Forgotpassword = require('./models/forgotpassword');
const DowloadedFiles=require('./models/downloadedfiles');



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

app.use((req,res) => {
    res.sendFile(path.join(__dirname,`public/${req.url}`))
})


mongoose
.connect(process.env.MONGOOSE_DB)
.then(()=>{
    console.log("Connection Succesfull");
})
.then(()=>{
    app.listen(process.env.PORT||3000);
}).catch(err=>console.log(err));