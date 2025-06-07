'use client';
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const SubscribeButton = ({ priceId }) => {
  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        console.error('Stripe failed to load');
        alert('Payment system is currently unavailable');
        return;
      }
      const response = await fetch('http://localhost:5000/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.sessionId) {
        const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
        if (result.error) {
          console.error('Stripe redirect error:', result.error);
          alert('Payment redirect failed: ' + result.error.message);
        }
      } else {
        console.error('No URL or sessionId in response:', data);
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout: ' + error.message);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
    >
      Subscribe Now
    </button>
  );
};

export default SubscribeButton;