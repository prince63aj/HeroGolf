const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};


// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, charityName, charityRate } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    const Charity = require('../models/Charity');
    let charity = await Charity.findOne({ name: charityName || 'Wildlife Conservation Trust' });
    if (!charity) {
      charity = await Charity.create({ name: charityName || 'Wildlife Conservation Trust', description: 'Charity organization' });
    }

    // In actual implementation, we'd wait for Stripe checkout to set role='subscriber'
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: 'subscriber', // Fast-tracking for PRD demo
      drawNumbers: [1, 2, 3, 4, 5], // Default assigned numbers
      charityConfig: { 
        charityId: charity._id, 
        contributionPercent: Number(charityRate) || 10 
      }
    });
    
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        drawNumbers: user.drawNumbers,
        token: generateToken(user._id)
      });
      
      sendEmail({
        email: user.email,
        subject: 'Welcome to Digital Heroes Golf Platform',
        html: `<h2>Welcome, ${user.name}!</h2><p>You have successfully registered to our platform. Let's make an impact!</p>`
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        drawNumbers: user.drawNumbers,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      drawNumbers: user.drawNumbers,
      charityConfig: user.charityConfig
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @route PUT /api/auth/profile/draw-numbers
router.put('/profile/draw-numbers', protect, async (req, res) => {
  const { drawNumbers } = req.body;
  
  if (!drawNumbers || drawNumbers.length !== 5) {
    return res.status(400).json({ message: 'Please provide exactly 5 numbers.' });
  }
  
  const uniqueNumbers = [...new Set(drawNumbers)];
  if (uniqueNumbers.length !== 5) {
    return res.status(400).json({ message: 'All numbers must be unique.' });
  }

  const inRange = drawNumbers.every(n => n >= 1 && n <= 50);
  if (!inRange) {
    return res.status(400).json({ message: 'Numbers must be between 1 and 50.' });
  }

  const user = await User.findById(req.user._id);
  if (user) {
    user.drawNumbers = drawNumbers.sort((a,b) => a - b);
    const updatedUser = await user.save();
    res.json({ drawNumbers: updatedUser.drawNumbers });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;
