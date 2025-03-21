
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/user');


const handleRegisterUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('✅ Register route hit');
  console.log('Request body:', req.body);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

   
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      name,
      email,
      password,
      otp,
      otpExpires,
      isVerified: false
    });

    await user.save();

    await sendEmail(
      user.email,
      `Complete Your Account Verification`, // Subject
      `Hi ${user.name},\n\n` + 
      `Thank you for registering with us! To complete your account verification, please use the One-Time Password (OTP) provided below:\n\n` + 
      `Your OTP: ${user.otp}\n\n` + 
      `Please enter this OTP within the next 10 minutes to verify your account and activate all features.\n\n` + 
      `If you did not request this verification, please disregard this email.\n\n` + 
      `Thank you,\n` + 
      `[URL Shortener]`
    );
    

    return res.status(201).json({ message: 'User registered. Please verify OTP.' });
  } catch (error) {
    console.error('Register Error:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
};





async function handleLoginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'Invalid email or account not verified' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }


    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

  
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}



const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
 
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // ✅ Check if OTP is valid and not expired
    if (!user.otp || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // ✅ Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Account verified successfully!' });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};



const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await sendEmail(
      user.email,
      'Password Reset OTP',
      `Your password reset OTP is: ${otp}`
    );

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

 
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) 
      {return res.status(400).json({ message: 'Invalid OTP' });}

    user.password = newPassword;
    user.otp = null;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports={
handleRegisterUser,
handleLoginUser,
resetPassword,
forgotPassword,
verifyOTP
}
