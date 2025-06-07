
"use client"
import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  LinearProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  CheckCircle,
  Cancel,
  ArrowBack 
} from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPassword() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  // Verify token on component mount
  useEffect(() => {
    if (!token) {
      setError('No reset token provided');
      setVerifyingToken(false);
      return;
    }

    verifyResetToken();
  }, [token]);

  const verifyResetToken = async () => {
    try {
    
      const response = await fetch(`http://localhost:5000/api/forgot-password/verify-reset-token/${token}`);
      const data = await response.json();

      if (response.ok) {
        setTokenValid(true);
      } else {
        setError(data.message || 'Invalid or expired reset token');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setError('Network error. Please try again.');
    } finally {
      setVerifyingToken(false);
    }
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const checks = [
      { test: password.length >= 8, message: 'At least 8 characters' },
      { test: /[a-z]/.test(password), message: 'One lowercase letter' },
      { test: /[A-Z]/.test(password), message: 'One uppercase letter' },
      { test: /\d/.test(password), message: 'One number' },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), message: 'One special character' }
    ];

    const passed = checks.filter(check => check.test).length;
    const feedback = checks.map(check => ({
      message: check.message,
      passed: check.test
    }));

    setPasswordStrength({
      score: passed,
      feedback: feedback
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
     
     const response = await fetch('http://localhost:5000/api/forgot-password/reset-password',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return '#f44336';
    if (passwordStrength.score <= 3) return '#ff9800';
    if (passwordStrength.score <= 4) return '#2196f3';
    return '#4caf50';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Fair';
    if (passwordStrength.score <= 4) return 'Good';
    return 'Strong';
  };

  // Show loading state while verifying token
  if (verifyingToken) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#1da9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={50} sx={{ color: '#1da9ff', mb: 2 }} />
            <Typography>Verifying reset token...</Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Show error state for invalid token
  if (!tokenValid) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#1da9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ mb: 2, color: '#f44336' }}>❌</Typography>
            <Typography variant="h5" sx={{ mb: 2, color: '#f44336' }}>Invalid Reset Link</Typography>
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              This password reset link is invalid or has expired. Please request a new one.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button component={Link} href="/forgot-password" variant="contained" sx={{ bgcolor: '#1da9ff' }}>
                Request New Link
              </Button>
              <Button component={Link} href="/login" variant="outlined" sx={{ borderColor: '#1da9ff', color: '#1da9ff' }}>
                Back to Login
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#1da9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm">
        {/* Back to Login Button */}
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
            Back to Login
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

          {!success ? (
            <>
              {/* Header */}
              <Typography variant="h4" sx={{ 
                textAlign: 'center', 
                mb: 2, 
                color: '#1da9ff', 
                fontWeight: 'bold' 
              }}>
                Reset Your Password
              </Typography>
              
              <Typography variant="body1" sx={{ 
                textAlign: 'center', 
                mb: 4, 
                color: 'text.secondary' 
              }}>
                Enter your new password below. Make sure it's strong and secure.
              </Typography>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* New Password Field */}
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="New Password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  sx={{ 
                    mb: 2,
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
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? 
                            <VisibilityOff sx={{ color: '#1da9ff' }} /> : 
                            <Visibility sx={{ color: '#1da9ff' }} />
                          }
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        Password Strength:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: getPasswordStrengthColor()
                        }}
                      >
                        {getPasswordStrengthText()}
                      </Typography>
                    </Box>
                    
                    <LinearProgress
                      variant="determinate"
                      value={(passwordStrength.score / 5) * 100}
                      sx={{
                        mb: 1,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getPasswordStrengthColor(),
                          borderRadius: 3,
                        },
                      }}
                    />
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      {passwordStrength.feedback.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                          {item.passed ? (
                            <CheckCircle sx={{ fontSize: 16, color: '#4caf50', mr: 0.5 }} />
                          ) : (
                            <Cancel sx={{ fontSize: 16, color: '#f44336', mr: 0.5 }} />
                          )}
                          <Typography variant="caption" sx={{ 
                            color: item.passed ? '#4caf50' : '#f44336',
                            fontSize: '0.75rem'
                          }}>
                            {item.message}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Confirm Password Field */}
                <TextField
                  fullWidth
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  error={formData.confirmPassword && formData.newPassword !== formData.confirmPassword}
                  helperText={
                    formData.confirmPassword && formData.newPassword !== formData.confirmPassword 
                      ? 'Passwords do not match' 
                      : ''
                  }
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
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? 
                            <VisibilityOff sx={{ color: '#1da9ff' }} /> : 
                            <Visibility sx={{ color: '#1da9ff' }} />
                          }
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={
                    loading || 
                    !formData.newPassword || 
                    !formData.confirmPassword ||
                    formData.newPassword !== formData.confirmPassword ||
                    passwordStrength.score < 3
                  }
                  sx={{ 
                    py: 1.5,
                    bgcolor: '#1da9ff',
                    '&:hover': {
                      bgcolor: '#0c8de0',
                    },
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ mb: 2, color: '#4caf50' }}>✅</Typography>
                
                <Typography variant="h4" sx={{ 
                  mb: 2, 
                  color: '#4caf50', 
                  fontWeight: 'bold' 
                }}>
                  Password Reset Successful!
                </Typography>
                
                <Alert severity="success" sx={{ mb: 3 }}>
                  Your password has been successfully reset. You can now log in with your new password.
                </Alert>
                
                <Typography variant="body1" sx={{ 
                  mb: 3, 
                  color: 'text.secondary' 
                }}>
                  Redirecting you to the login page in a few seconds...
                </Typography>

                <Button
                  component={Link}
                  href="/login"
                  variant="contained"
                  sx={{ 
                    bgcolor: '#1da9ff',
                    '&:hover': { bgcolor: '#0c8de0' }
                  }}
                >
                  Go to Login
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}