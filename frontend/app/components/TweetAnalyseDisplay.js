"use client";
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

export default function TweetDisplay() {
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ color: '#0099E8', fontWeight: 'bold' }}
        >
          Summary :
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
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: '#e1f0fa',
          minHeight: 150,
          width: '100%',
          margin: '0 auto',
          boxShadow: `
            20px 20px 15px -3px rgba(0, 0, 0, 0.2),
            0px 20px 25px -5px rgba(0, 0, 0, 0.1),
            0px 5px 5px rgba(0, 0, 0, 0.05)
          `,
        }}
      >
        <TextField 
          fullWidth 
          multiline 
          rows={4} 
          placeholder="Please enter your summary text :" 
          variant="outlined" 
          sx={{ 
            color: '#666', 
            backgroundColor: '#fff',
            borderRadius: 2 
          }} 
        />
      </Paper>
    </Box>
  );
}
