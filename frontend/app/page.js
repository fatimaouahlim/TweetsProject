"use client"
import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Container, 
  InputAdornment, 
  IconButton,
  Paper,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff, Email } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
// app/login/page.js
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include' // Important for cookies
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store user data in localStorage (but not token)
    localStorage.setItem('user', JSON.stringify(data.data));
    
    // Redirect to dashboard or home page
    router.push('/search');
  } catch (error) {
    console.error('Login error:', error);
    setError(error.message || 'Failed to login. Please check your credentials.');
  } finally {
    setLoading(false);
  }
};
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        bgcolor: '#1da9ff',
        padding: 0,
        margin: 0,
        width: '100%',
        maxWidth: '100%'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          width: '100%',
          padding: 4
        }}
      >
        {/* Top - Twanalyze Logo */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'flex-start',
          width: '100%',
          ml: -3
        }}>
          <Box
            sx={{
              width: 190,
              height: 100,
              position: 'relative',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              transform: 'scale(1.05)',
              transition: 'transform 0.3s ease-in-out',
              
              '&:hover': {
                transform: 'scale(1.1)', // Scale up slightly on hover
              
              },// slight 3D effect
            }}
          >
            <Image
              src="/Twanalyzelogov2.png"
              alt="Twanalyze Logo"
              width={700}
              height={700}
              priority
            />
          </Box>
        </Box>

        {/* Middle section - Elon Musk Tweet and Login Form side by side */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            width: '100%',
            justifyContent: 'center',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 4,
            flex: 1
          }}
        >
          {/* Left side - Elonmasktweet image */}
          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              flex: 1,
              maxWidth: '550px',
              mt: 10,
              ml: 2,
              mr: 10
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: 'auto',
                position: 'relative',
                boxShadow: '0 40px 40px rgba(0, 0, 0, 0.2)', // Added shadow
                borderRadius: 2,
                overflow: 'hidden',
                transform: 'scale(1.05)',
                transition: 'transform 0.3s ease-in-out',
                
                '&:hover': {
                  transform: 'scale(1.1)', // Scale up slightly on hover
                
                },// slight 3D effect
              }}
            >
              <Image
                src="/Elonmasktweet.png"
                alt="Elon Musk Tweet"
                width={500}
                height={450}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain'
                
                }}
              />
            </Box>
          </Box>

          {/* Right side - Login Form WITH BLUR EFFECT */}
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 3,
              mt:'-90px',
              width: { xs: '100%', sm: '390px' },
              backgroundColor: 'hsla(208, 85.10%, 76.30%, 0.65)',
              backdropFilter: 'blur(10px)',
              transform: 'scale(1.05)', // Slight 3D effect
              transition: 'transform 0.3s ease-in-out',
              boxShadow: '40px 40px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                transform: 'scale(1.1)', // Scale up slightly on hover
                boxShadow: ' 20px 20px rgba(31, 38, 135, 0.3)', // Stronger shadow on hover
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Box sx={{ 
                width: 750,
                height: 100,
               
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

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Email, username"
                name="username"
                autoComplete="email"
                value={formData.username}
                onChange={handleChange}
                variant="outlined"
                sx={{ 
                  mb: 2, 
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
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
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                sx={{ 
                  mb: 3, 
                  bgcolor: 'rgba(255, 255, 255, 0.5)',
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
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
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
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  mt: 1, 
                  mb: 3, 
                  py: 1.5,
                  bgcolor: '#1da9ff',
                  '&:hover': {
                    bgcolor: '#0c8de0',
                  },
                  borderRadius: 8
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  Don't have an account? 
                  <Link href="/register" passHref>
                    <Typography 
                      component="span" 
                      sx={{ 
                        ml: 0.5, 
                        color: '#1da9ff', 
                        fontWeight: 'bold',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                    >
                      Register
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}