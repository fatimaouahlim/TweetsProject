"use client";

import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Layout from '../components/layout';
import TweetDisplay from '../components/TweetAnalyseDisplay';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'; 
import Link from 'next/link';

export default function Home() {
  const [tweets, setTweets] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const router = useRouter()

   useEffect(() => {
   
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const handleAnalyzeClick = () => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      // Example analysis result
      setTweets([
        { id: 1, text: "Sample analyzed tweet" },
        { id: 2, text: "Another tweet" },
      ]);
    }, 1500);
  };

  const handleAnalysisComplete = (newTweets) => {
    setTweets(newTweets);
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
        {/* Header section */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          {/* Logo or image if needed */}
        </Box>

        {/* Main content */}
        <Box>
          <TweetDisplay 
            tweets={tweets} 
            onAnalyzeComplete={handleAnalysisComplete} 
          />
        </Box>

        {/* Action button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
         <Link href='/sentiment'>
        
          <Button
            variant="contained"
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing}
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
          </Link>
        </Box>
      </Container>
    </Layout>
  );
}
