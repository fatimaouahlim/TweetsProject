"use client"
import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';


export default function ForgotPassword() {
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
     const response = await fetch('http://localhost:5000/api/forgot-password/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmailSent(true);
        setEmail(''); 
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    setMessage('');
    setError('');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#1da9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm">
        {/* Back to Login  */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            component={Link}
            href="/login"
            startIcon={<ArrowBack />}
            sx={{ 
              color: 'white', 
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
              textTransform: 'none'
            }}
          >
          </Button>
        </Box>

        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: 'hsla(208, 85.10%, 76.30%, 0.9)',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ 
              width: 180,
              height: 50,
              position: 'relative' 
            }}>
              <Image
                src="/Twanalyzev2.png"
                alt="Twanalyze"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
          </Box>

          {!emailSent ? (
            <>
              {/* Header */}
              <Typography variant="h4" sx={{ 
                textAlign: 'center', 
                mb: 2, 
                color: '#1da9ff', 
                fontWeight: 'bold' 
              }}>
                Forgot Password?
              </Typography>
              
              <Typography variant="body1" sx={{ 
                textAlign: 'center', 
                mb: 4, 
                color: 'text.secondary' 
              }}>
                No worries! Enter your email address and we'll send you a link to reset your password.
              </Typography>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  sx={{ 
                    mb: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(29, 169, 255, 0.5)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#1da9ff',
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email sx={{ color: '#1da9ff' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading || !email.trim()}
                  sx={{ 
                    py: 1.5,
                    bgcolor: '#1da9ff',
                    '&:hover': {
                      bgcolor: '#0c8de0',
                    },
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    position: 'relative'
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Sending Reset Link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ mb: 2 }}>📧</Typography>
                
                <Typography variant="h4" sx={{ 
                  mb: 2, 
                  color: '#1da9ff', 
                  fontWeight: 'bold' 
                }}>
                  Check Your Email
                </Typography>
                
                <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
                  {message}
                </Alert>
                
                <Typography variant="body1" sx={{ 
                  mb: 3, 
                  color: 'text.secondary',
                  lineHeight: 1.6 
                }}>
                  We've sent a password reset link to your email address. 
                  Please check your inbox and follow the instructions to reset your password.
                </Typography>

                <Box sx={{ 
                  bgcolor: 'rgba(255, 193, 7, 0.1)', 
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  borderRadius: 2,
                  p: 2,
                  mb: 3
                }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>Didn't receive the email?</strong><br />
                    • Check your spam/junk folder<br />
                    • Make sure you entered the correct email address<br />
                    • The link expires in 10 minutes
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    onClick={handleResendEmail}
                    variant="outlined"
                    sx={{ 
                      borderColor: '#1da9ff',
                      color: '#1da9ff',
                      '&:hover': {
                        borderColor: '#0c8de0',
                        bgcolor: 'rgba(29, 169, 255, 0.05)'
                      }
                    }}
                  >
                    Try Different Email
                  </Button>
                  
                  <Button
                    component={Link}
                    href="/login"
                    variant="text"
                    sx={{ color: '#1da9ff' }}
                  >
                    Back to Login
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}