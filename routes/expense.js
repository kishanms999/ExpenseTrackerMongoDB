const express = require('express');

const expenseController = require('../controllers/expense');

const userauthentication=require('../middleware/auth')

const router = express.Router();

router.post('/add-expense',userauthentication.authenticate,expenseController.insertExpense);

router.get('/get-expenses',userauthentication.authenticate,expenseController.getexpenses);

router.delete('/delete-expense/:id',userauthentication.authenticate,expenseController.deleteExpense);

router.get('/download',userauthentication.authenticate,expenseController.downloadexpense)

module.exports = router;