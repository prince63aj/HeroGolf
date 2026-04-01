const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const WinnerClaim = require('../models/WinnerClaim');
const { protect } = require('../middleware/authMiddleware');

// Ensure uploads dir
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'proof-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'), false);
  }
});

router.post('/', protect, upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No screenshot uploaded' });
    
    // Fallback to mock ids ONLY if req.body or req.user isn't available
    const userId = req.user ? req.user._id : '6543b3556093510c4d234ea7';
    const drawId = req.body.drawId || '6543b3556093510c4d234ea8';

    const claim = new WinnerClaim({
      userId,
      drawId,
      proofImageUrl: `/uploads/${req.file.filename}`
    });

    await claim.save();
    res.status(201).json({ message: 'Proof submitted successfully', claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
