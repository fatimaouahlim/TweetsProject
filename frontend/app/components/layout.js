"use client";
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Image from 'next/image';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" sx={{ backgroundColor: 'white' }}>
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          paddingLeft: '0 !important', // Remove left padding from Toolbar
          minHeight: '80px !important', // Match your image height
          boxShadow: `
            100px 20px 15px -2px rgba(50, 50, 50, 0.14),
            10px 20px 25px -5px rgba(0, 0, 0, 0.09),
            10px 5px 50px rgba(81, 81, 81, 0.14)
          `,
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            marginLeft: '0px', // Ensure no left margin
            paddingLeft: '0px' // Ensure no left padding
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
              marginLeft: '0px' // Remove any potential margin
            }}>
              <Image
                src="/twanalyzelogov3.jpg"
                alt="TwAnalyze Logo"
                fill
                style={{ objectFit: 'cover' }} // Use 'cover' to fill the space completely
                priority
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="text" 
              sx={{ 
                color: '#0099E8', 
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(0, 153, 232, 0.08)'
                }
              }}
            >
              CONTACT US
            </Button>
            <Button 
              variant="text" 
              sx={{ 
                color: '#0099E8', 
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(0, 153, 232, 0.08)'
                }
              }}
            >
              ABOUT US
            </Button>
            <Button 
              variant="text" 
              startIcon={<LogoutIcon />}
              sx={{ 
                color: '#0099E8', 
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(0, 153, 232, 0.08)'
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