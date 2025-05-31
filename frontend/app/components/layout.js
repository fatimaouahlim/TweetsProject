"use client";
import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Image from 'next/image';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  History as HistoryIcon, 
  Search as SearchIcon, 
  Analytics as AnalyticsIcon,
  Email as EmailIcon,
  ContactMail as ContactUsIcon,
  Info as AboutUsIcon,
  Payment as SubscribeIcon,
  Dashboard as AdminIcon
} from '@mui/icons-material';

export default function Layout({ children }) {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserRole = () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Raw token:', token);
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const role = payload.role || payload.userRole;
          setUserRole(role);  
          console.log('Extracted role:', role);
        }
      } catch (error) {
        console.error('Error getting user role:', error);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUserRole();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      sessionStorage.clear();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" sx={{ backgroundColor: 'white' }}>
        <Toolbar sx={{
          justifyContent: 'space-between',
          paddingLeft: '0 !important',
          minHeight: '80px !important',
          boxShadow: `
            100px 20px 15px -2px rgba(50, 50, 50, 0.14),
            10px 20px 25px -5px rgba(0, 0, 0, 0.09),
            10px 5px 50px rgba(81, 81, 81, 0.14)
          `,
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '0px',
            paddingLeft: '0px'
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              borderRadius:'4px',
              width: 100,
              height: 80,
              position: 'relative',
              overflow: 'hidden',
              marginLeft: '0px'
            }}>
              <Link href={'/search'}>
                <Image
                  src="/twanalyzelogov3.jpg"
                  alt="TwAnalyze Logo"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </Link>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Admin Dashboard - Only show for admin users */}
            {isAdmin && (
              <Link href="/AdminInterface" passHref>
                <Button 
                  color="inherit" 
                  startIcon={<AdminIcon />}
                  sx={{
                    color: '#0099E8',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 153, 232, 0.08)'
                    }
                  }}
                >
                  Admin Dashboard
                </Button>
              </Link>
            )}

            <Link href="/subscribe">
              <Button
                variant="text"
                startIcon={<SubscribeIcon />}
                sx={{
                  color: '#0099E8',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 153, 232, 0.08)'
                  }
                }}
              >
                Subscribe
              </Button>
            </Link>
  
            <Link href="/History" passHref>
              <Button 
                color="inherit" 
                startIcon={<HistoryIcon />}
                sx={{
                  color: '#0099E8',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 153, 232, 0.08)'
                  }
                }}
              >
                History
              </Button>
            </Link>
            
            <Link href={'/contactus'}>
              <Button
                variant="text"
                startIcon={<ContactUsIcon />}
                sx={{
                  color: '#0099E8',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 153, 232, 0.08)'
                  }
                }}
              >
                Contact Us
              </Button>
            </Link>
            
            <Link href={'/Aboutus'}>
              <Button
                variant="text"
                startIcon={<AboutUsIcon />}
                sx={{
                  color: '#0099E8',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 153, 232, 0.08)'
                  }
                }}
              >
                About Us
              </Button>
            </Link>
            
            <Button
              variant="text"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: '#0099E8',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(0, 153, 232, 0.08)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
}