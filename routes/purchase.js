const express=require('express')
const purchaseController=require('../controllers/purchase');
const authenticatemiddlware=require('../middleware/auth');
const router = express.Router();
router.get('/premiummembership',authenticatemiddlware.authenticate,purchaseController.purchasepremium);
router.post('/updatetransactionstatus',authenticatemiddlware.authenticate, purchaseController.updateTransactionStatus);
module.exports = router;

