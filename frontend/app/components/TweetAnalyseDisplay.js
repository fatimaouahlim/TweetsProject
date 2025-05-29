"use client";
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

export default function TweetDisplay({ inputText, setInputText, analysisResult, initialQuery }) {
  
  const handleTextChange = (event) => {
    const newValue = event.target.value;
    
    // Make sure setInputText is a function before calling it
    if (typeof setInputText === 'function') {
      setInputText(newValue);
    }
  };

  const saveToHistory = async (sentimentData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Get search type from URL or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const searchType = urlParams.get('type') || 'Topics';

      await fetch('http://localhost:5000/api/history/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: initialQuery || inputText, // Use initialQuery if available, otherwise use inputText
          search_type: searchType,
          tweets_data: [], // No tweets data in this component
          summary: inputText, // The text being analyzed
          sentiment_analysis: sentimentData
        })
      });
    } catch (error) {
      console.error('Failed to save to history:', error);
      // Don't show error to user, as this is not critical
    }
  };

  // Save to history when analysis result is available
  React.useEffect(() => {
    if (analysisResult && (initialQuery || inputText)) {
      saveToHistory(analysisResult);
    }
  }, [analysisResult, initialQuery, inputText]);

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
          value={inputText || ""} // Ensure it's never undefined
          onChange={handleTextChange}
          sx={{ 
            color: '#666', 
            backgroundColor: '#fff',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ccc',
              },
              '&:hover fieldset': {
                borderColor: '#0099E8',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0099E8',
              },
            },
          }} 
        />
      </Paper>
    </Box>
  );
}