"use client";
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Image from 'next/image';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Layout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear JWT token from localStorage
      localStorage.removeItem('token');
      
      // You could also call a logout endpoint if you have one
      // const response = await fetch('/api/auth/logout', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      
      // Clear any other auth-related data
      sessionStorage.clear();
      
      // Redirect to login page after logout
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect to login even if logout API call fails
      router.push('/login');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#29aaff',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.47)',
          zIndex: 1100
        }}
      >
        <Toolbar sx={{
          justifyContent: 'space-between',
          paddingLeft: '0 !important', 
          minHeight: '80px !important',
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
              borderRadius: '4px',
              width: 100,
              height: 80,
              position: 'relative',
              overflow: 'hidden',
              marginLeft: '0px'
            }}>
              {/* Logo could be placed here */}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="text"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(138, 204, 237, 0.69)'
                }
              }}
            >
              CONTACT US
            </Button>
            <Button
              variant="text"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(138, 204, 237, 0.69)'
                }
              }}
            >
              ABOUT US
            </Button>
            <Button
              variant="text"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(138, 204, 237, 0.69)'
                }
              }}
            >
              LOGOUT
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