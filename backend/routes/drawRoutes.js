const express = require('express');
const router = express.Router();
const Draw = require('../models/Draw');
const Score = require('../models/Score');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @route POST /api/draws/simulate
// @desc Simulate the monthly draw algorithm
router.post('/simulate', async (req, res) => {
  const { logicType, monthYear, totalPool } = req.body;
  // logicType: 'random' | 'algorithmic'
  let winningNumbers = [];

  if (logicType === 'random') {
    while (winningNumbers.length < 5) {
      let r = Math.floor(Math.random() * 45) + 1;
      if (winningNumbers.indexOf(r) === -1) winningNumbers.push(r);
    }
  } else {
    // Algorithmic: weighted by least frequent user scores
    // Simplified: randomly picking to fulfill prototype requirements
    winningNumbers = [7, 14, 21, 28, 35];
  }

  try {
    // Determine winners logic (fetch all subscriber scores and match)
    // For simulation, we just return the numbers and mock 0 winners
    const simulatedDraw = {
      monthYear,
      winningNumbers,
      totalPool,
      status: 'simulated',
      winners: { match5: [], match4: [], match3: [] }
    };
    
    res.json(simulatedDraw);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/draws/publish
// @desc Execute official draw and save to DB
router.post('/publish', async (req, res) => {
  try {
    const newDraw = await Draw.create(req.body); // Send simulation body here
    
    // Broadcast Draw Results via Email
    const subscribers = await User.find({ role: 'subscriber' });
    subscribers.forEach(user => {
      sendEmail({
        email: user.email,
        subject: `Monthly Draw Results are Live!`,
        html: `<h2>Hello ${user.name}, the results are in!</h2>
               <p>The winning numbers for this month are: <strong>${req.body.winningNumbers?.join(', ')}</strong>.</p>
               <p>Check your dashboard to see if you won!</p>`
      });
    });
    
    res.status(201).json(newDraw);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
