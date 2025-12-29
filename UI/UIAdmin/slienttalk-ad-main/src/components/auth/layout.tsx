'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';

import { paths } from '@/paths';


export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',

        // ⭐ Nền được thay y hệt SideNav
        backgroundImage: `
          linear-gradient(145deg, #09A3FB 15%, #09A3FB 30%, #2877ED 100%)
        `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'screen',

        p: 3,
      }}
    >
      {/* Logo phía trên form */}
      <Box marginTop={6} marginLeft={-2}
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          component={RouterLink}
          href={paths.home}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
          }}
        >
          <Box
            component="img"
            src="/assets/logo.svg"
            alt="Logo"
            sx={{
              height: 50,
              width: 'auto',
            }}
          />
        </Box>
      </Box>

      {/* Form đăng nhập */}
      <Box marginTop={9}
        sx={{
          width: '100%',
          maxWidth: 450,
          bgcolor: 'white',
          borderRadius: 2,
          p: 4,
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
