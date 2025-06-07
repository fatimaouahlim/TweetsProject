"use client"
import Head from 'next/head';
import { useState } from 'react';
import Layout from '../components/layout';
import Link from 'next/link';
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [activeTab, setActiveTab] = useState('contact');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear any previous error/success messages when user starts typing
    if (submitStatus) {
      setSubmitStatus(null);
      setSubmitMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');
    
    try {
      // Updated API endpoint to match your backend
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(data.message || 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24-48 hours.');
        // Reset form after successful submission
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || 'An error occurred while sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      if (error.message === 'Server returned non-JSON response') {
        setSubmitMessage('Server error. Please check if the backend server is running.');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setSubmitMessage('Cannot connect to server. Please check if the backend is running on port 5000.');
      } else {
        setSubmitMessage('Network error. Please check your connection and try again.');
      }
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
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{submitMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{submitMessage}</p>
                        </div>
                      </div>
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
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1da9ff] focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-black disabled:text-black"
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
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1da9ff] focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-black disabled:text-black"
                          placeholder="example@gmail.com"
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
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1da9ff] focus:border-transparent transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-black disabled:text-black"
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
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1da9ff] focus:border-transparent transition-colors resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed text-black disabled:text-black"
                        placeholder="Tell us more about your inquiry..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1da9ff] hover:bg-[#38b6ff] disabled:bg-[#bbe1f4] disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
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
                      <Link
                        href="mailto:twanalyze.team@gmail.com" 
                        className="text-gray-600 hover:underline"
                      >
                        twanalyze.team@gmail.com
                      </Link>
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