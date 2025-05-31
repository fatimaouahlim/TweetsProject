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
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  ExpandMore
} from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function IntegratedLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    console.log('Login component mounted');
    const existingToken = localStorage.getItem('token');
    console.log('Existing token on login page:', existingToken);
    
    // If user is already logged in, redirect to search
    if (existingToken) {
      console.log('User already has token, redirecting to search');
      router.push('/search');
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('Login form submitted with:', formData);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      
      console.log('Login response status:', response.status);
      
      const data = await response.json();
      console.log('Login response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token and user data
      if (data.token) {
        console.log('Storing token:', data.token);
        localStorage.setItem('token', data.token);
      } else {
        console.error('No token received in response');
      }
      
      // Store user data (adjust based on your backend response structure)
      const userData = {
        id: data.id,
        username: data.username,
        email: data.email
      };
      console.log('Storing user data:', userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Verify storage
      console.log('Token stored:', localStorage.getItem('token'));
      console.log('User stored:', localStorage.getItem('user'));
      
      // Small delay to ensure localStorage is updated
      setTimeout(() => {
        console.log('Redirecting to search page');
        router.push('/search');
      }, 100);
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setError(''); // Clear any previous errors
    
    // Client-side validation (matching backend validation)
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      setError('All fields are required');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    // Validate field lengths (matching backend validation)
    if (contactForm.name.length > 255 || contactForm.email.length > 255 || contactForm.subject.length > 255) {
      setError('Field length exceeds maximum allowed (255 characters)');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }

    // Validate email format (matching backend validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      setSubmitStatus('error');
      return;
    }
    
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name.trim(),
          email: contactForm.email.trim().toLowerCase(),
          subject: contactForm.subject.trim(),
          message: contactForm.message.trim()
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      console.log('Contact form submitted successfully:', data);
      setSubmitStatus('success');
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setError(''); // Clear any errors on success
      
      // Optional: Show success message from backend
      if (data.message) {
        console.log('Backend message:', data.message);
      }
      
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
      setError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const features = [
    {
      title: "Tweet Collection",
      description: "Automatically gather tweets based on keywords, hashtags, or user accounts",
      icon: "📊"
    },
    {
      title: "Smart Summarization", 
      description: "AI-powered summarization that extracts key insights from large volumes of tweets",
      icon: "📝"
    },
    {
      title: "Sentiment Analysis",
      description: "Advanced sentiment analysis to understand public opinion and emotional trends",
      icon: "🎯"
    }
  ];

  const faqs = [
    {
      question: "How many tweets can I analyze at once?",
      answer: "Our standard plan allows up to 10,000 tweets per analysis. Enterprise plans offer unlimited analysis capabilities."
    },
    {
      question: "What languages are supported for sentiment analysis?",
      answer: "Currently, we support English, Spanish, French, German, and Portuguese. More languages are being added regularly."
    },
    {
      question: "How accurate is the sentiment analysis?",
      answer: "Our AI models achieve 85-92% accuracy depending on the content type. We continuously improve our algorithms based on user feedback."
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#1da9ff' }}>
      {/* Blue Section with Login */}
      <Container 
        maxWidth={false} 
        sx={{ 
          display: 'flex', 
          bgcolor: '#1da9ff',
          padding: 0,
          margin: 0,
          width: '100%',
          maxWidth: '100%',
          minHeight: '100vh'
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
                  transform: 'scale(1.1)',
                },
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

          {/* Middle section - Tweet and Login Form side by side */}
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
                  boxShadow: '0 40px 40px rgba(0, 0, 0, 0.2)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transform: 'scale(1.05)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
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

            {/* Right side - Login Form Only */}
            <Paper
              elevation={4}
              sx={{
                p: 0,
                borderRadius: 3,
                mt: '-90px',
                width: { xs: '100%', sm: '450px' },
                backgroundColor: 'hsla(208, 85.10%, 76.30%, 0.65)',
                backdropFilter: 'blur(10px)',
                transform: 'scale(1.05)',
                transition: 'transform 0.3s ease-in-out',
                boxShadow: '40px 40px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '20px 20px rgba(31, 38, 135, 0.3)',
                },
              }}
            >
              {/* Logo */}
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Box sx={{ 
                  width: 200,
                  height: 60,
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

              {/* Login Form Content */}
              <Box sx={{ p: 3 }}>
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
                      bgcolor: 'rgba(255, 255, 255, 0.7)',
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
                      bgcolor: 'rgba(255, 255, 255, 0.7)',
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
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/* White Section - About Us */}
      <Box sx={{ bgcolor: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ mb: 4, color: '#1da9ff', fontWeight: 'bold', textAlign: 'center' }}>
            About Twanalyze
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8, textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            Transform the chaos of social media into actionable insights with our powerful 
            tweet analysis platform that combines AI-driven summarization with advanced sentiment analysis.
          </Typography>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#1da9ff', fontWeight: 'bold', textAlign: 'center' }}>
              Our Mission
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8, textAlign: 'center', maxWidth: '900px', mx: 'auto', fontSize: '1.1rem' }}>
              In today's fast-paced digital world, understanding public sentiment and trends 
              is crucial for businesses, researchers, and individuals alike. We believe that 
              everyone should have access to powerful analytics tools that can help them make 
              informed decisions based on social media data.
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ mb: 4, color: '#1da9ff', fontWeight: 'bold', textAlign: 'center' }}>
            Key Features
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, mb: 6 }}>
            {features.map((feature, index) => (
              <Paper key={index} sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(29, 169, 255, 0.1)',
                border: '2px solid rgba(29, 169, 255, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 48px rgba(29, 169, 255, 0.2)',
                }
              }}>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  {feature.icon}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1da9ff', mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </Paper>
            ))}
          </Box>

          <Paper sx={{ p: 6, bgcolor: 'rgba(29, 169, 255, 0.05)', borderRadius: 3, border: '2px solid rgba(29, 169, 255, 0.1)' }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#1da9ff', fontWeight: 'bold', textAlign: 'center' }}>
              Privacy & Security First
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, textAlign: 'center' }}>
              <Box>
                <Typography variant="h3" sx={{ mb: 1 }}>🔒</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                  All data is encrypted and processed securely
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" sx={{ mb: 1 }}>🛡️</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                  GDPR and privacy regulation compliant
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" sx={{ mb: 1 }}>⚡</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                  Analysis data is processed and not permanently stored
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ mb: 4, color: '#1da9ff', fontWeight: 'bold', textAlign: 'center' }}>
            Get in Touch
          </Typography>

          <Paper sx={{ p: 4, borderRadius: 3, mb: 6, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
            {submitStatus === 'success' && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thank you! Your message has been sent successfully. We'll get back to you within 24-48 hours.
              </Alert>
            )}
            
            {submitStatus === 'error' && error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleContactSubmit}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                <TextField
                  fullWidth
                  name="name"
                  label="Full Name"
                  required
                  value={contactForm.name}
                  onChange={handleContactChange}
                  error={submitStatus === 'error' && !contactForm.name}
                  helperText={submitStatus === 'error' && !contactForm.name ? 'Name is required' : ''}
                  inputProps={{ maxLength: 255 }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(29, 169, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#1da9ff',
                      },
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  name="email"
                  label="Email Address"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={handleContactChange}
                  error={submitStatus === 'error' && (!contactForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email))}
                  helperText={
                    submitStatus === 'error' && !contactForm.email 
                      ? 'Email is required' 
                      : submitStatus === 'error' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)
                      ? 'Please enter a valid email address'
                      : ''
                  }
                  inputProps={{ maxLength: 255 }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(29, 169, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#1da9ff',
                      },
                    },
                  }}
                />
              </Box>
              
              <TextField
                fullWidth
                name="subject"
                
                select
                required
                value={contactForm.subject}
                onChange={handleContactChange}
                error={submitStatus === 'error' && !contactForm.subject}
                helperText={submitStatus === 'error' && !contactForm.subject ? 'Please select a subject' : ''}
                SelectProps={{ native: true }}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(29, 169, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1da9ff',
                    },
                  },
                }}
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="business">Business/Enterprise Inquiry</option>
                <option value="api">API Access</option>
                <option value="support">Technical Support</option>
              </TextField>
              
              <TextField
                fullWidth
                name="message"
                label="Message"
                multiline
                rows={5}
                required
                value={contactForm.message}
                onChange={handleContactChange}
                error={submitStatus === 'error' && !contactForm.message}
                helperText={submitStatus === 'error' && !contactForm.message ? 'Message is required' : ''}
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(29, 169, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1da9ff',
                    },
                  },
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{ 
                  py: 2,
                  bgcolor: '#1da9ff',
                  '&:hover': {
                    bgcolor: '#0c8de0',
                  },
                  '&:disabled': {
                    bgcolor: 'rgba(29, 169, 255, 0.3)',
                  },
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Paper>

          <Typography variant="h4" sx={{ mb: 4, color: '#1da9ff', fontWeight: 'bold', textAlign: 'center' }}>
            Frequently Asked Questions
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            {faqs.map((faq, index) => (
              <Accordion key={index} sx={{ 
                mb: 2, 
                borderRadius: 2,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': {
                  margin: '8px 0',
                }
              }}>
                <AccordionSummary 
                  expandIcon={<ExpandMore sx={{ color: '#1da9ff' }} />}
                  sx={{ 
                    '& .MuiAccordionSummary-content': {
                      margin: '16px 0',
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1da9ff' }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}