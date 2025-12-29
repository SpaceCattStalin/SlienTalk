import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiButton = {
  styleOverrides: {
    root: { 
      borderRadius: '12px',
      textTransform: 'none',
    },
    containedPrimary: {
      background: 'linear-gradient(145deg, #09A3FB 15%, #09A3FB 30%, #2877ED 100%)',
      '&:hover': {
        background: 'linear-gradient(145deg, #09A3FB 15%, #2877ED 75%, #2877ED 100%)',
      }
    },
    sizeSmall: { padding: '6px 16px' },
    sizeMedium: { padding: '8px 20px' },
    sizeLarge: { padding: '11px 24px' },
    textSizeSmall: { padding: '7px 12px' },
    textSizeMedium: { padding: '9px 16px' },
    textSizeLarge: { padding: '12px 16px' },
  },
} satisfies Components<Theme>['MuiButton'];
