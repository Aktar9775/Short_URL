const express = require('express');
const {handleRegisterUser,handleLoginUser,resetPassword,
  forgotPassword,
  verifyOTP}=require('../controller/user')
const router = express.Router();
router.post('/register',handleRegisterUser);
router.post('/login',handleLoginUser);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
module.exports = router;
