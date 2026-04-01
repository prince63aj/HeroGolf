const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  monthYear: { type: String, required: true }, // e.g., 'March 2026'
  winningNumbers: [{ type: Number }], // Array of 5 numbers
  totalPool: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['simulated', 'published'], default: 'simulated' },
  rolloverAmount: { type: Number, default: 0 },
  winners: {
    match5: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    match4: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    match3: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Draw', drawSchema);
