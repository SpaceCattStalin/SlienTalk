'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { navItems } from './config';
import { navIcons } from './nav-icons';

interface SideNavProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

export function SideNav({ isMobile = false, onNavigate }: SideNavProps): React.JSX.Element {
  const pathname = usePathname();

  return (
    <Box
      suppressHydrationWarning
      sx={{
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'rgba(255, 255, 255, 0.9)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.1)',
        '--NavItem-active-background': 'rgba(255, 255, 255, 0.2)',
        '--NavItem-active-color': '#fff',
        '--NavItem-disabled-color': 'rgba(255, 255, 255, 0.4)',
        '--NavItem-icon-color': 'rgba(255, 255, 255, 0.85)',
        '--NavItem-icon-active-color': '#fff',
        '--NavItem-icon-disabled-color': 'rgba(255, 255, 255, 0.4)',

        backgroundImage: `
          linear-gradient(145deg, #09A3FB 15%, #09A3FB 30%, #2877ED 100%)
        `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'screen',

        color: 'var(--SideNav-color)',

        // ❗ FIX: Mobile Drawer phải hiển thị, không được hidden
        display: isMobile ? 'flex' : { xs: 'none', lg: 'flex' },

        flexDirection: 'column',
        height: '100%',
        ...(isMobile
          ? {}
          : {
              position: 'fixed',
              left: 0,
              top: 0,
              width: 'var(--SideNav-width)',
              zIndex: 'var(--SideNav-zIndex)',
            }),
      }}
    >
      {/* Header */}
      <Stack suppressHydrationWarning spacing={2} sx={{ p: 3, pl: 4, pr: 2 }}>
        <Box
          component={RouterLink}
          href={paths.home}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 1.5,
            textDecoration: 'none',
          }}
          onClick={onNavigate}
        >
          <Box
            component="img"
            src="/assets/logo.svg"
            alt="Logo"
            sx={{ height: 35, width: 'auto' }}
          />
        </Box>
      </Stack>

      <Box
        suppressHydrationWarning
        component="nav"
        sx={{
          flex: '1 1 auto',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          p: '12px',
        }}
      >
        <Stack
          suppressHydrationWarning
          component="ul"
          spacing={1}
          sx={{ listStyle: 'none', m: 0, p: 0, width: '100%' }}
        >
          {renderNavItems({ pathname, items: navItems, onNavigate })}
        </Stack>
      </Box>
    </Box>
  );
}

/* ---------------------- Helper ---------------------- */

function renderNavItems({
  items = [],
  pathname,
  onNavigate,
}: {
  items?: NavItemConfig[];
  pathname: string;
  onNavigate?: () => void;
}): React.JSX.Element {
  return (
    <>
      {items.map((item) => {
        const { key, ...rest } = item; // tách key ra
        return (
          <NavItem
            key={key}
            pathname={pathname}
            onNavigate={onNavigate}
            {...rest}
          />
        );
      })}
    </>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
  onNavigate?: () => void;
}

function NavItem({
  disabled,
  external,
  href,
  icon,
  matcher,
  pathname,
  title,
  onNavigate,
}: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  const handleClick = () => {
    if (onNavigate) onNavigate(); // ✔ đóng drawer
  };

  return (
    <li>
      <Box
        onClick={handleClick}
        {...(href
          ? {
            component: external ? 'a' : RouterLink,
            href,
            target: external ? '_blank' : undefined,
            rel: external ? 'noreferrer' : undefined,
          }
          : { role: 'button' })}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          gap: 1,
          p: '6px 16px',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          transition: 'all 0.25s ease',
          ...(active && {
            bgcolor: 'var(--NavItem-active-background)',
            color: 'var(--NavItem-active-color)',
          }),
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.08)',
          },
        }}
      >
        {Icon && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon
              fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          </Box>
        )}

        <Typography sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500 }}>
          {title}
        </Typography>
      </Box>
    </li>
  );
}
