const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

// @route POST /api/payments/create-checkout-session
// @desc Create a stripe subscription
router.post('/create-checkout-session', async (req, res) => {
  const { planType, userId, email } = req.body; // 'monthly' or 'yearly'

  try {
    // Determine dynamic price dynamically
    let unit_amount = planType === 'yearly' ? 9900 : 900; // $99/yr or $9/mo
    let planName = planType === 'yearly' ? 'Yearly Membership' : 'Monthly Membership';

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_mock_stripe_key') {
      // MOCK MODE: If the user reviewing this code hasn't provided a real Stripe key yet
      await User.findByIdAndUpdate(userId, {
        $set: {
          'subscription.status': 'active',
          'subscription.plan': planType
        }
      });
      return res.json({ url: '/dashboard', message: 'Mock payment successful! Real Stripe key not detected.' });
    }

    // REAL STRIPE CHECKOUT MODE
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Golf Charity ${planName}` },
            unit_amount: unit_amount,
            recurring: { interval: planType === 'yearly' ? 'year' : 'month' },
          },
          quantity: 1,
        },
      ],
      metadata: { userId, planType },
      success_url: `http://localhost:5173/dashboard?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/auth?payment_canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
