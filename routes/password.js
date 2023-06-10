const express = require('express');

const passswordController = require('../controllers/password');

//const authenticatemiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/forgotpassword', passswordController.forgotPassword);

router.get('/updatepassword/:resetpasswordid', passswordController.updatePassword);

router.get('/resetpassword/:id', passswordController.resetPassword);


module.exports = router;