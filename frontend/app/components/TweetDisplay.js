"use client";
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

export default function TweetDisplay() {
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ color: '#0099E8', fontWeight: 'bold' }}
        >
          Tweets :
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            component="img" 
            src="/bird.png" 
            alt="Bird" 
            sx={{ 
              width: 160, 
              height: 60, 
              mr: -2,
              mb: -3
            }} 
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#1e8dd4',
              borderRadius: 28,
              '&:hover': {
                backgroundColor: '#007bb5',
              },
            }}
          >
            summary
          </Button>
        </Box>
      </Box>

      {/* Main Tweets Box */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: '#e1f0fa',
          minHeight: 400,
          width: '100%',
          boxShadow: `
            20px 20px 15px -3px rgba(0, 0, 0, 0.2),
            0px 20px 25px -5px rgba(0, 0, 0, 0.1),
            0px 5px 5px rgba(0, 0, 0, 0.05)
          `,
          mb: 3
        }}
      >
        <Typography variant="body1" sx={{ color: '#666' }}>
          Tweets will appear here
        </Typography>
      </Paper>
      <Box sx={{ display: 'flex', alignItems: 'center' }}></Box>
      <Typography
          variant="h6"
          component="div"
          sx={{ color: '#0099E8', fontWeight: 'bold',
         
           }}
        >
          summary :
        </Typography>
         <Box 
            component="img" 
            src="/bird.png" 
            alt="Bird" 
            sx={{ 
              width: 160, 
              height: 60, 
              ml: 30,
              mb: -1
            }} 
          />
      {/* Summary Box - Smaller than tweets box */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: '#e1f0fa', // Slightly different color
          minHeight: 150, // Smaller height
          width: '100%', // Narrower width
          margin: '0 auto', // Center the box
          boxShadow: `
          20px 20px 15px -3px rgba(0, 0, 0, 0.2),
          0px 20px 25px -5px rgba(0, 0, 0, 0.1),
          0px 5px 5px rgba(0, 0, 0, 0.05)
        `,
        }}
      >
         
        
        <Typography variant="body1" sx={{ color: '#666' }}>
          Tweet summary will appear here
        </Typography>
      </Paper>
 </Box>
);
}
