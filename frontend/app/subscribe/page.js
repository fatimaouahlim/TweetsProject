"use client";
import React, { useState } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import Layout from '../components/layout';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const priceIdPlus = 'price_1RUSN2RtEF0mNtedrYtvcXuG';
const priceIdPro = 'price_1RUU7bRtEF0mNtedQsQxG39C';

export default function PricingPage() {
  const [selectedTab, setSelectedTab] = useState('Personal');

  const [isLoading, setIsLoading] = useState(false);

  // Fixed the API endpoint URL - removed duplicate path
  const handleSubscribe = async (priceId) => {
    setIsLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const response = await fetch(
        "http://localhost:5000/api/create-checkout-session", // Fixed URL
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.sessionId) {
        const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
        if (result.error) throw new Error(result.error.message);
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      alert("An error occurred during checkout: " + error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
<Layout>
     <div className="min-h-screen bg-gradient-to-br from-[#bbe1f4] to-blue-50 flex flex-col items-center justify-center p-8">
    
      <div className="max-w-7xl w-full">
          <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Upgrade Your<span className="text-[#1da9ff]"> Plan</span>
            </h1>
        </div>  
        {/* Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setSelectedTab('Personal')}
              className={`px-6 py-2 rounded-md transition-colors ${
                selectedTab === 'Personal' 
                  ? 'bg-[#1da9ff] text-white' 
                  : 'text-gray-600 hover:text-[#1da9ff]'
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setSelectedTab('Business')}
              className={`px-6 py-2 rounded-md transition-colors ${
                selectedTab === 'Business' 
                  ? 'bg-[#1da9ff] text-white' 
                  : 'text-gray-600 hover:text-[#1da9ff]'
              }`}
            >
              Business
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Free Plan */}
          <div className="bg-white rounded-lg p-8 border-2 border-gray-200 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Free</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-800">$0</span>
              <span className="text-gray-500 ml-2">USD/month</span>
            </div>
            <p className="text-gray-600 mb-8">
              Discover what people are saying about any topic with basic sentiment analysis
            </p>
            <button className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg mb-8 cursor-not-allowed">
              Your current plan
            </button>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">1 topic search per day</span>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Limited to 10 tweets per search</span>
              </div>
            </div>
          </div>

          {/* Plus Plan */}
          <div className="bg-white rounded-lg p-8 border-2 border-blue-500 relative shadow-xl">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                POPULAR
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Plus</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-800">$20</span>
              <span className="text-gray-500 ml-2">USD/month</span>
            </div>
            <p className="text-gray-600 mb-8">
             Scale your social media research with unlimited topic searches and advanced insights
            </p>
           <button
              disabled={isLoading}
              onClick={() => handleSubscribe(priceIdPlus)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg mb-8 transition-colors shadow-md disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Get Plus"}
            </button>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Unlimited topic searches</span>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Advanced sentiment analysis (includes emotions like joy, anger, fear, surprise)</span>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg p-8 border-2 border-blue-500 relative shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Pro</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-800">$200</span>
              <span className="text-gray-500 ml-2">USD/month</span>
            </div>
           <p className="text-gray-600 mb-8">
              All Plus features plus higher tweet analysis capacity
            </p>
            <button
              disabled={isLoading}
              onClick={() => handleSubscribe(priceIdPro)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg mb-8 transition-colors shadow-md disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Get Pro"}
            </button>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                 <span className="text-gray-700">Everything in Plus</span>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Up to 100 tweets per search</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}