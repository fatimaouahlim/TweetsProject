"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/layout';

export default function PricingPage() {
  const [selectedTab, setSelectedTab] = useState('Personal');

  return (
    <Layout>
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-7xl w-full">
       <div className="text-center mb-12">
       <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Upgrade Your<span className="text-[#1da9ff]"> Plan</span>
            </h1>
        </div>
        {/* Tab Selector */}
       <div className="flex justify-center mb-8">
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
                <svg className="w-5 h-5 text-[#1da9ff] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">1 topic search per day</span>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-[#1da9ff] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Limited to 10 tweets per search</span>
              </div>
            </div>
          </div>

          {/* Plus Plan */}
          <div className="bg-white rounded-lg p-8 border-2 border-[#1da9ff] relative shadow-xl">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-[#1da9ff] text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
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
            <Link href="/payment?plan=plus&price=20">
              <button className="w-full bg-[#1da9ff] hover:bg-blue-600 text-white font-medium py-3 rounded-lg mb-8 transition-colors shadow-md">
                Get Plus
              </button>
            </Link>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-[#1da9ff] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Unlimited topic searches</span>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-[#1da9ff] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Advanced sentiment analysis (includes emotions like joy, anger, fear, surprise)</span>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg p-8 border-2 border-[#1da9ff] relative shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Pro</h2>
            <div className="mb-6">
              <span className="text-4xl font-bold">$200</span>
              <span className="text-gray-500 ml-2">USD/month</span>
            </div>
           <p className="text-gray-600 mb-8">
              All Plus features plus higher tweet analysis capacity
            </p>
            <Link href="/payment2?plan=pro&price=200">
              <button className="w-full bg-[#1da9ff] hover:bg-blue-600 text-white font-medium py-3 rounded-lg mb-8 transition-colors shadow-md">
                Get Pro
              </button>
            </Link>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-[#1da9ff] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                 <span className="text-gray-700">Everything in Plus</span>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-[#1da9ff] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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