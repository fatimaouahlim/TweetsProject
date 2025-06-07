const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log('Creating checkout session...');
    console.log('Request body:', req.body);
    
    const { priceId, email } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Map price IDs to plan names
    const planNames = {
      'price_1RUSN2RtEF0mNtedrYtvcXuG': 'Twanalyze Plus',
      'price_1RUU7bRtEF0mNtedQsQxG39C': 'Twanalyze Pro'
    };

    const planName = planNames[priceId] || 'Unknown Plan';

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CORS_ORIGIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CORS_ORIGIN}/cancel`,
      billing_address_collection: 'auto',
      payment_method_collection: 'always',
      metadata: {
        plan_name: planName,
        price_id: priceId
      },
      subscription_data: {
        metadata: {
          plan_name: planName,
          price_id: priceId
        }
      }
    };

    // Add customer email if provided
    if (email) {
      sessionConfig.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Checkout session created:', session.id);
    console.log('Plan name:', planName);
    console.log('Session URL:', session.url);
    
    res.json({ 
      url: session.url,
      sessionId: session.id,
      planName: planName
    });
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
});

module.exports = router;