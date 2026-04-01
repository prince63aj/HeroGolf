const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['visitor', 'subscriber', 'admin'], default: 'visitor' },
  subscription: {
    status: { type: String, enum: ['inactive', 'active'], default: 'inactive' },
    plan: { type: String, enum: ['monthly', 'yearly', 'none'], default: 'none' },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String }
  },
  charityConfig: {
    charityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
    contributionPercent: { type: Number, default: 10, min: 10, max: 100 }
  },
  drawNumbers: [{ type: Number }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
