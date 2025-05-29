// pages/contact.js or app/contact/page.js (depending on your Next.js version)
"use client"
import Head from 'next/head';
import { useState } from 'react';
import Layout from '../components/layout';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('contact');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question: "How many tweets can I analyze at once?",
      answer: "Our standard plan allows up to 10,000 tweets per analysis. Enterprise plans offer unlimited analysis capabilities."
    },
    {
      question: "What languages are supported for sentiment analysis?",
      answer: "Currently, we support English, Spanish, French, German, and Portuguese. More languages are being added regularly."
    },
    {
      question: "Is there an API available?",
      answer: "Yes! We offer a RESTful API for developers. Contact us for API documentation and access credentials."
    },
    {
      question: "How accurate is the sentiment analysis?",
      answer: "Our AI models achieve 85-92% accuracy depending on the content type. We continuously improve our algorithms based on user feedback."
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer: "Absolutely! We provide tailored solutions for large organizations with specific requirements. Contact our sales team for more information."
    }
  ];

  return (
  <Layout>
      <Head>
        <title>Contact Us - Twanalyze</title>
        <meta name="description" content="Get in touch with the Twanalyze team. We're here to help with your tweet analysis needs." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#bbe1f4] to-blue-50">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Get in <span className="text-[#1da9ff]">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about Twanalyze? We'd love to hear from you. 
              Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-2 rounded-md transition-colors ${
                  activeTab === 'contact'
                    ? 'bg-[#1da9ff] text-white'
                    : 'text-gray-600 hover:text-[#1da9ff]'
                }`}
              >
                Contact Form
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-6 py-2 rounded-md transition-colors ${
                  activeTab === 'faq'
                    ? 'bg-[#1da9ff] text-white'
                    : 'text-gray-600 hover:text-[#1da9ff]'
                }`}
              >
                FAQ
              </button>
            </div>
          </div>

          {activeTab === 'contact' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                  
                  {submitStatus === 'success' && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                      Thank you! Your message has been sent successfully. We'll get back to you within 24-48 hours.
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      Sorry, there was an error sending your message. Please try again or contact us directly.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1da9ff] focus:border-transparent transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1da9ff] focus:border-transparent transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1da9ff] focus:border-transparent transition-colors"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="bug">Bug Report</option>
                        <option value="feature">Feature Request</option>
                        <option value="business">Business/Enterprise Inquiry</option>
                        <option value="api">API Access</option>
                        <option value="support">Technical Support</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1da9ff] focus:border-transparent transition-colors resize-vertical"
                        placeholder="Tell us more about your inquiry..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1da9ff] hover:bg-[#38b6ff] disabled:bg-[#bbe1f4] text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="bg-[#bbe1f4] p-2 rounded-lg mr-4">
                        <span className="text-[#1da9ff] text-xl">✉️</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Email</p>
                        <p className="text-gray-600">support@twanalyze.com</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-[#bbe1f4] p-2 rounded-lg mr-4">
                        <span className="text-[#1da9ff] text-xl">⏰</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Response Time</p>
                        <p className="text-gray-600">24-48 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#1da9ff] to-[#38b6ff] rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">Need Faster Support?</h3>
                  <p className="mb-4 opacity-90">
                    For urgent technical issues or enterprise inquiries, reach out directly.
                  </p>
                  <button className="bg-white text-[#1da9ff] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Priority Support
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="bg-[#1da9ff] hover:bg-[#38b6ff] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Contact Us Directly
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
 </Layout>
  );
}