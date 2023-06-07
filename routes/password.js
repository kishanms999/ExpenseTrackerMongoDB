const express = require('express');

const premiumFeatureController = require('../controllers/password');

//const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/forgotpassword', premiumFeatureController.resetPassword);


module.exports = router;