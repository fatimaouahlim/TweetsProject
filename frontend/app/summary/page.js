"use client";
import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Layout from '../components/layout';
import TweetDisplay from '../components/TweetDisplay';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          
        </Box>
        <TweetDisplay tweets={[]} />
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
