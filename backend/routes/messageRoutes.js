const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// POST /api/messages - Submit a new contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    res.status(201).json({ message: 'Message securely saved to database.', data: newMessage });
  } catch (error) {
    console.error('Contact Form Error:', error);
    res.status(500).json({ message: 'Server error while saving contact message.' });
  }
});

module.exports = router;
