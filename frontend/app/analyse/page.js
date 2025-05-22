"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Layout from '../components/layout';
import TweetDisplay from '../components/TweetAnalyseDisplay';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [tweets, setTweets] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [inputText, setInputText] = useState(""); // User input
  const [analysisResult, setAnalysisResult] = useState(null); // Result

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // Use useCallback to ensure the function reference is stable
  const handleInputTextChange = useCallback((newText) => {
    setInputText(newText);
  }, []);

  const handleAnalyzeClick = async () => {
    // Check if user has entered text
    if (!inputText.trim()) {
      alert("Please enter some text to analyze");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Call your FastAPI backend
      const response = await fetch('http://localhost:8000/api/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Transform the result to match your frontend format
      const transformedResult = {
        positive: result.positive || 0,
        negative: result.negative || 0,
        neutral: result.neutral || 0,
        dominant_sentiment: result.dominant_sentiment,
        confidence: result.confidence
      };

      // Save to localStorage and set local state
      localStorage.setItem("analysisResult", JSON.stringify(transformedResult));
      setAnalysisResult(transformedResult);

      setIsAnalyzing(false);
      router.push('/sentiment');

    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      setIsAnalyzing(false);
      alert(`Failed to analyze sentiment: ${error.message}. Please make sure your backend is running.`);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}></Box>

        <Box>
          <TweetDisplay
            inputText={inputText}
            setInputText={handleInputTextChange}
            analysisResult={analysisResult}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing || !inputText.trim()}
            sx={{
              backgroundColor: '#1e8dd4',
              borderRadius: 28,
              px: 4,
              py: 1,
              '&:hover': {
                backgroundColor: '#007bb5',
              },
            }}
          >
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </Box>
      </Container>
    </Layout>
  );
}