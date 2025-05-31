// pages/history/page.js
'use client';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import Layout from '../components/layout';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchHistory();
  }, [page, router]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/history?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch history');
      }

      setHistory(data.data);
      setTotalPages(data.pagination.total_pages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (historyId) => {
    if (!confirm('Are you sure you want to delete this search history?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/history/${historyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setHistory(history.filter(item => item.id !== historyId));
      } else {
        throw new Error('Failed to delete history item');
      }
    } catch (err) {
      alert('Failed to delete history item: ' + err.message);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment.includes('pos') || sentiment.includes('LABEL_2')) return 'success';
    if (sentiment.includes('neg') || sentiment.includes('LABEL_0')) return 'error';
    return 'default';
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ pt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
               Search <span className="text-[#1da9ff]">History</span>
            </h1>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {history.length === 0 ? (
          <Alert severity="info">
            No search history found. Start searching to see your history here.
          </Alert>
        ) : (
          <>
            {history.map((item) => (
              <Card key={item.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="between" alignItems="start">
                    <Box flex={1}>
                      <Box display="flex" gap={1} mb={2}>
                        <Chip 
                          label={item.search_type} 
                          size="small" 
                          color="primary"
                        />
                        <Chip 
                          label={item.sentiment_analysis?.dominant_sentiment || 'N/A'} 
                          size="small" 
                          color={getSentimentColor(item.sentiment_analysis?.dominant_sentiment || '')}
                        />
                      </Box>
                      
                      <Typography variant="h6" gutterBottom>
                        {item.query}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {formatDate(item.created_at)}
                      </Typography>
                      
                      {item.summary && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Summary:</strong> {item.summary.substring(0, 150)}
                          {item.summary.length > 150 && '...'}
                        </Typography>
                      )}
                      
                      <Typography variant="caption" color="text.secondary">
                        {item.tweets_data?.length || 0} tweets analyzed
                      </Typography>
                    </Box>
                    
                    <Box>
                      <IconButton 
                        onClick={() => handleViewDetails(item)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDelete(item.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={(e, newPage) => setPage(newPage)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}

        {/* Details Dialog */}
        <Dialog 
          open={detailsOpen} 
          onClose={() => setDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Search Details: {selectedItem?.query}
          </DialogTitle>
          <DialogContent>
            {selectedItem && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Summary
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedItem.summary}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Sentiment Analysis
                </Typography>
                <Box mb={2}>
                  <Typography variant="body2">
                    <strong>Dominant:</strong> {selectedItem.sentiment_analysis?.dominant_sentiment}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Confidence:</strong> {selectedItem.sentiment_analysis?.confidence}%
                  </Typography>
                  <Typography variant="body2">
                    Positive: {selectedItem.sentiment_analysis?.positive}% | 
                    Negative: {selectedItem.sentiment_analysis?.negative}% | 
                    Neutral: {selectedItem.sentiment_analysis?.neutral}%
                  </Typography>
                </Box>

                <Typography variant="h6" gutterBottom>
                  Tweets ({selectedItem.tweets_data?.length || 0})
                </Typography>
                <Box maxHeight={300} overflow="auto">
                  {selectedItem.tweets_data?.map((tweet, index) => (
                    <Card key={index} sx={{ mb: 1 }}>
                      <CardContent sx={{ py: 1 }}>
                        <Typography variant="body2">
                          {tweet.text}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}