"use client";
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';


export default function TweetDisplay({ initialQuery = '' }) {
  const [tweets, setTweets] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [summaryText, setSummaryText] = useState("Tweet summary will appear here");
  const [loading, setLoading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText)
      .then(() => {
        setSnackbarMessage('Summary copied to clipboard!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        setSnackbarMessage('Failed to copy text!');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const saveToHistory = async (tweetsData, summaryText) => {
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
          query: initialQuery,
          search_type: searchType,
          tweets_data: tweetsData,
          summary: summaryText,
          sentiment_analysis: null // No sentiment analysis in this component
        })
      });
    } catch (error) {
      console.error('Failed to save to history:', error);
      // Don't show error to user, as this is not critical
    }
  };

  const fetchTweets = async (query) => {
    if (!query) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/search-tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          max_results: 10
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTweets(data.tweets);
        if (data.tweets.length === 0) {
          setSnackbarMessage('No tweets found for this query');
          setSnackbarSeverity('info');
          setOpenSnackbar(true);
        }
      } else {
        setSnackbarMessage(`Error: ${data.detail}`);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error fetching tweets:', error);
      setSnackbarMessage('Failed to connect to server');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    if (tweets.length === 0) {
      setSnackbarMessage('No tweets to summarize');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
    
    setSummarizing(true);
    try {
      // Combine all tweet texts
      const combinedText = tweets.map(tweet => tweet.text).join(' ');
      
      const response = await fetch('http://localhost:8000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: combinedText,
          max_length: 230,
          min_length: 30
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSummaryText(data.summary);
        
        // Save to history after successful summary generation
        await saveToHistory(tweets, data.summary);
      } else {
        setSnackbarMessage(`Error: ${data.detail}`);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setSnackbarMessage('Failed to generate summary');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setSummarizing(false);
    }
  };

  // If initialQuery is provided, fetch tweets when component mounts
  React.useEffect(() => {
    if (initialQuery) {
      fetchTweets(initialQuery);
    }
  }, [initialQuery]);

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
            onClick={generateSummary}
            disabled={summarizing || tweets.length === 0}
            sx={{
              backgroundColor: '#1e8dd4',
              borderRadius: 28,
              '&:hover': {
                backgroundColor: '#007bb5',
              },
            }}
          >
            {summarizing ? <CircularProgress size={24} color="inherit" /> : 'Summary'}
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
          boxShadow: 
            '20px 20px 15px -3px rgba(0, 0, 0, 0.2), 0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 5px 5px rgba(0, 0, 0, 0.05)',
          mb: 3,
          overflowY: 'auto'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : tweets.length > 0 ? (
          tweets.map((tweet, index) => (
            <Box key={tweet.id || index} sx={{ mb: 2, p: 2, borderRadius: 1, backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
              <Typography variant="body1" sx={{ color: '#333' }}>
                {tweet.text}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', py: 10 }}>
            Tweets will appear here
          </Typography>
        )}
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ color: '#0099E8', fontWeight: 'bold' }}
        >
          Summary :
        </Typography>
        <Box 
          component="img" 
          src="/bird.png" 
          alt="Bird" 
          sx={{ 
            width: 160, 
            height: 60, 
            ml: 'auto',
            mr: 2,
            mb: -1
          }} 
        />
      </Box>
      
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
          boxShadow: 
            '20px 20px 15px -3px rgba(0, 0, 0, 0.2), 0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 5px 5px rgba(0, 0, 0, 0.05)',
          position: 'relative',
        }}
      >
        <Typography variant="body1" sx={{ color: '#666' }}>
          {summaryText}
        </Typography>
        
        <Tooltip title="Copy summary to clipboard">
          <IconButton
            onClick={handleCopy}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: '#0099E8',
              color: 'white',
              '&:hover': {
                backgroundColor: '#007bb5',
              },
            }}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </Paper>
      
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}