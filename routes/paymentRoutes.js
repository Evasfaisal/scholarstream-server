const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd', metadata = {} } = req.body;
        if (!amount) return res.status(400).json({ message: 'Amount is required' });
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount),
            currency,
            metadata,
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
