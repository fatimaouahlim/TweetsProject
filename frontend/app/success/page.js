'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      fetchSessionData(sessionId);
    }
  }, [sessionId]);

  const fetchSessionData = async (sessionId) => {
    try {
      // You'll need to create this endpoint to retrieve session data
      const response = await fetch(`http://localhost:5000/api/checkout-session/${sessionId}`);
      const data = await response.json();
      setSessionData(data);
    } catch (error) {
      console.error('Error fetching session data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  const planName = sessionData?.metadata?.plan_name || 'your selected plan';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank you for subscribing!
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome to <span className="font-semibold text-blue-600">{planName}</span>
          </p>
        </div>
        


        <div className="space-y-4">
          <a
            href="/login"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Go to login
          </a>
          <a
            href="/search"
            className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Return search
          </a>
        </div>
      </div>
    </div>
  );
}