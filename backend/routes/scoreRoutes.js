const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
// Note: normally we'd protect these routes with a JWT middleware

// @route POST /api/scores
// @desc Enter a new score (keeps only the last 5)
router.post('/', async (req, res) => {
  const { userId, points, datePlayed } = req.body;
  if (!userId || !points || !datePlayed) return res.status(400).json({ message: 'Missing fields' });

  try {
    // 1. Add the new score
    const newScore = await Score.create({
      user: userId,
      points,
      datePlayed
    });

    // 2. Fetch all scores for user ordered by date played (newest first)
    const userScores = await Score.find({ user: userId }).sort({ datePlayed: -1 });

    // 3. Rolling logic - delete if more than 5
    if (userScores.length > 5) {
      // The scores beyond the 5th index are the oldest, delete them
      const scoresToDelete = userScores.slice(5).map(s => s._id);
      await Score.deleteMany({ _id: { $in: scoresToDelete } });
    }

    // 4. Return the new constrained list
    const finalScores = await Score.find({ user: userId }).sort({ datePlayed: -1 }).limit(5);
    res.status(201).json(finalScores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/scores/:userId
router.get('/:userId', async (req, res) => {
  try {
    const scores = await Score.find({ user: req.params.userId }).sort({ datePlayed: -1 }).limit(5);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
