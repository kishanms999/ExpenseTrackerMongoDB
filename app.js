const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const sequelize=require('./util/database');

const User=require('./models/Expenses')
var cors=require('cors');

const app = express();

app.use(cors());


const expenseRoutes=require('./routes/expense');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(expenseRoutes);



sequelize.sync().then(result=>{
    app.listen(3000);
})
    
.catch(err=>{
    console.log(err);
})