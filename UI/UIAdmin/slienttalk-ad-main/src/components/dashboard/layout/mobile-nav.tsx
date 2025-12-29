'use client';

import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import RouterLink from 'next/link';

import { SideNav } from '@/components/dashboard/layout/side-nav';
import { paths } from '@/paths';

export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <Drawer
      anchor="left"
      PaperProps={{
        sx: {
          bgcolor: 'transparent',        // để SideNav render full background gradient
          width: 'var(--MobileNav-width)',
          zIndex: 'var(--MobileNav-zIndex)',
          overflow: 'hidden',
        },
      }}
      open={open}
      onClose={onClose}
    >
      

      {/* --- SIDENAV CUSTOM (mobile mode) --- */}
      <SideNav isMobile onNavigate={onClose} />
    </Drawer>
  );
}
