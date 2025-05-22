"use client";
import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Layout from '../components/layout';
import TweetDisplay from '../components/TweetDisplay';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'; 
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('');
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
    
    // Get query parameters from URL
    const urlQuery = searchParams.get('query');
    const urlType = searchParams.get('type');
    
    if (urlQuery) {
      setQuery(urlQuery);
      setSearchType(urlType || 'Topics');
    } else {
      // If no query parameter, redirect back to search
      router.push('/search');
    }
  }, [router, searchParams]);

  return (
    <Layout>
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
        <Typography variant="h4" sx={{color: '#0099E8' , fontWeight: 'bold' }}>
          Results for {searchType}: {query}
        </Typography>
        
        <TweetDisplay initialQuery={query} />
        
      <Typography variant="body1" sx={{ color: '#004aad' , fontWeight: 'bold'

        ,mt:5,ml:20
               }}>
        Find out if your tweet is Positive, Negative or Neutral in seconds 
        </Typography>
        <Link href='/analyse'>
         <Button
            variant="contained"
            sx={{
              backgroundColor: '#1e8dd4',
              borderRadius: 28,ml:45,mt:4,
              '&:hover': {
                backgroundColor: '#007bb5',
              },
            }}
          >
           Analyze Now
          </Button>
          </Link>
      </Container>
    </Layout>
  );
}