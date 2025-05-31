// pages/about.js or app/about/page.js (depending on your Next.js version)
"use client"
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../components/layout';

export default function About() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Tweet Collection",
      description: "Automatically gather tweets based on keywords, hashtags, or user accounts",
      icon: "📊"
    },
    {
      title: "Smart Summarization",
      description: "AI-powered summarization that extracts key insights from large volumes of tweets",
      icon: "📝"
    },
    {
      title: "Sentiment Analysis",
      description: "Advanced sentiment analysis to understand public opinion and emotional trends",
      icon: "🎯"
    }
  ];

  return (
   <Layout>
      <Head>
        <title>About Us - Twanalyze</title>
        <meta name="description" content="Learn about Twanalyze - Your powerful tweet analysis and sentiment tracking platform" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#bbe1f4] to-blue-50">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              About <span className="text-[#1da9ff]">Twanalyze</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform the chaos of social media into actionable insights with our powerful 
              tweet analysis platform that combines AI-driven summarization with advanced sentiment analysis.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  In today's fast-paced digital world, understanding public sentiment and trends 
                  is crucial for businesses, researchers, and individuals alike. Twanalyze was 
                  born from the need to make sense of the overwhelming amount of information on Twitter.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We believe that everyone should have access to powerful analytics tools that 
                  were once only available to large corporations with extensive resources.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-[#1da9ff] to-[#38b6ff] rounded-full w-48 h-48 mx-auto flex items-center justify-center">
                  <span className="text-6xl">🚀</span>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">How Twanalyze Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                    activeFeature === index ? 'shadow-2xl scale-105 border-2 border-[#1da9ff]' : 'shadow-lg hover:shadow-xl hover:border-[#bbe1f4] border-2 border-transparent'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

       {/* Performance Highlights */}
<div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
  <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Lightning Fast Performance</h2>
  <div className="grid md:grid-cols-2 gap-8">
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Speed Advantages</h3>
      <ul className="space-y-2 text-gray-600">
        <li className="flex items-center"><span className="text-[#1da9ff] mr-2">✓</span> Instant loading for seamless experience</li>
        <li className="flex items-center"><span className="text-[#1da9ff] mr-2">✓</span> Smooth animations and transitions</li>
        <li className="flex items-center"><span className="text-[#1da9ff] mr-2">✓</span> Optimized for all network conditions</li>
      </ul>
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Efficiency Benefits</h3>
      <ul className="space-y-2 text-gray-600">
        <li className="flex items-center"><span className="text-[#1da9ff] mr-2">✓</span> Minimal wait times for results</li>
        <li className="flex items-center"><span className="text-[#1da9ff] mr-2">✓</span> Quick response to user interactions</li>
        <li className="flex items-center"><span className="text-[#1da9ff] mr-2">✓</span> Energy efficient operation</li>
      </ul>
    </div>
  </div>
</div>
          {/* Privacy & Security */}
          <div className="bg-gradient-to-r from-[#1da9ff] to-[#38b6ff] rounded-2xl p-8 text-white mb-12">
            <h2 className="text-3xl font-bold mb-4 text-center">Privacy & Security First</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold mb-2">Data Protection</h3>
                <p className="text-sm opacity-90">All data is encrypted and processed securely</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-semibold mb-2">Privacy Compliant</h3>
                <p className="text-sm opacity-90">GDPR and privacy regulation compliant</p>
              </div>
              <div>
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">No Data Storage</h3>
                <p className="text-sm opacity-90">Analysis data is processed and not permanently stored</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">Join thousands of users who trust Twanalyze for their social media insights</p>
            <div className="space-x-4">
              
             
            </div>
          </div>
        </div>
      </div>
   </Layout>
  );
}