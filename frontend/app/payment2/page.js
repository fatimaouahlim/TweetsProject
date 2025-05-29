"use client";
import React, { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import Layout from '../components/layout';

const OpenAICheckout = () => {
  const [formData, setFormData] = useState({
    cardNumber: '1234 1234 1234 1234',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    city: '',
    country: 'Morocco',
    saveInfo: false,
    businessPurchase: false,
    agreeToTerms: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Order Summary */}
      <div className="w-1/2 bg-white p-8 border-r border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
 
</div>

          <div className="mb-8">
            <h2 className="text-lg text-gray-700 mb-2">Subscribe to Twanalyze Pro Subscription</h2>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-black">$200.00</span>
              <span className="text-gray-600 ml-2">per month</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-900">Twanalyse Pro Subscription</div>
                <div className="text-sm text-gray-500">Billed monthly</div>
              </div>
              <span className="font-medium text-gray-900">$200.00</span>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Subtotal</span>
                <span className="font-medium text-gray-900">$200.00</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-700">Tax</span>
                  <Info className="w-4 h-4 text-gray-400 ml-1" />
                </div>
                <span className="text-gray-700">$0.00</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total due today</span>
                <span className="font-medium text-gray-900">$200.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Payment Form */}
      <div className="w-1/2 p-8" style={{ backgroundColor: '#e6f3ff' }}>
        <div className="max-w-md mx-auto">
          {/* Contact Information Section */}
          <div className="bg-white bg-opacity-70 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact information</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white"
                style={{ color: '#374151' }}
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment method</h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Card information</label>
            <div className="relative">
              <input
                type="text"
                placeholder="1234 1234 1234 1234"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-600 bg-white"
              />
              <div className="absolute right-3 top-2 flex space-x-1">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                <div className="w-8 h-5 bg-red-500 rounded"></div>
                <div className="w-8 h-5 bg-blue-400 rounded"></div>
                <div className="w-8 h-5 bg-gray-600 rounded"></div>
              </div>
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="MM / YY"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className="flex-1 px-3 py-2 border-l border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-600 bg-white"
              />
              <input
                type="text"
                placeholder="CVC"
                value={formData.cvc}
                onChange={(e) => handleInputChange('cvc', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-br-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-600 bg-white"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder name</label>
            <input
              type="text"
              placeholder="Full name on card"
              value={formData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-600 bg-white"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Billing address</label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-white"
            >
              <option>Morocco</option>
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </select>
            
            <input
              type="text"
              placeholder="Address line 1"
              value={formData.addressLine1}
              onChange={(e) => handleInputChange('addressLine1', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-600 bg-white"
            />
            
            <input
              type="text"
              placeholder="Address line 2"
              value={formData.addressLine2}
              onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-600 bg-white"

            />
            
            <div className="flex space-x-3">
              <input
                type="text"
                placeholder="Postal code"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-600 bg-white"
              />
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                             className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-600 bg-white"

              />
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-md bg-gray-50">
              <input
                type="checkbox"
                checked={formData.saveInfo}
                onChange={(e) => handleInputChange('saveInfo', e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">Securely save my information for 1-click checkout</div>
                <div className="text-sm text-gray-600">Pay faster on Twanalyze, LLC and everywhere Link is accepted.</div>
              </div>
            </label>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 mb-4">
            Subscribe
          </button>

          <div className="text-center text-sm text-gray-500">
            <div className="mb-2">Powered by <span className="font-medium">stripe</span></div>
            <div className="space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-700">Terms</a>
              <a href="#" className="text-gray-500 hover:text-gray-700">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default OpenAICheckout;