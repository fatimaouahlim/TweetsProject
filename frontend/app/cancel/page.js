// pages/cancel.js (Pages Router) or app/cancel/page.js (App Router)
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';

const CancelPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => router.push('/subscribe')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;