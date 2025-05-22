"use client";

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Layout from '../components/layout';

export default function SentimentPage() {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/search');
    }

    const storedResult = localStorage.getItem('analysisResult');
    if (storedResult) {
      const result = JSON.parse(storedResult);
      const formattedData = [
        { name: 'Positive', value: result.positive, color: '#0054A6' },
        { name: 'Negative', value: result.negative, color: '#0588D0' },
        { name: 'Neutral', value: result.neutral, color: '#55B4F3' }
      ];
      setData(formattedData);
    } else {
      // If no result found, go back
      router.push('/');
    }
  }, [router]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Layout>
        <div style={{
          flexGrow: 1,
          backgroundColor: '#BDE3FF',
          width: '100%',
          paddingTop: '1.5rem',
          paddingBottom: '2rem',
          minHeight: 'calc(100vh - 80px)'
        }}>
          <div style={{
            maxWidth: '768px',
            margin: '0 auto',
            padding: '0 1rem'
          }}>
            <div style={{
              backgroundColor: '#BDE3FF',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              minHeight: '500px'
            }}>
              <div style={{ height: '500px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={160}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Back to Search */}
            <div style={{ marginTop: '1.5rem' }}>
              <Link href="/search" style={{
                display: 'flex',
                alignItems: 'center',
                color: '#0099E8',
                fontWeight: 'bold',
                textDecoration: 'none'
              }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: '0.5rem' }}
                >
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to search
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
