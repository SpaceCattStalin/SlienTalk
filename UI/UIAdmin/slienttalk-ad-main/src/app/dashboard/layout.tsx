// 'use client';

// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
// import GlobalStyles from '@mui/material/GlobalStyles';

// import { AuthGuard } from '@/components/auth/auth-guard';
// import { MainNav } from '@/components/dashboard/layout/main-nav';
// import { SideNav } from '@/components/dashboard/layout/side-nav';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// export default function DashboardLayout({ children }: LayoutProps) {
//   return (
//     <AuthGuard>
//       <GlobalStyles
//         styles={{
//           body: {
//             '--MainNav-height': '56px',
//             '--MainNav-zIndex': 1000,
//             '--SideNav-width': '280px',
//             '--SideNav-zIndex': 1100,
//             '--MobileNav-width': '320px',
//             '--MobileNav-zIndex': 1100,
//           },
//         }}
//       />
//       <Box
//         sx={{
//           bgcolor: 'var(--mui-palette-background-default)',
//           display: 'flex',
//           flexDirection: 'column',
//           position: 'relative',
//           minHeight: '100%',
//         }}
//       >
//         <SideNav />
//         <Box
//           sx={{
//             display: 'flex',
//             flex: '1 1 auto',
//             flexDirection: 'column',
//             pl: { lg: 'var(--SideNav-width)' },
//           }}
//         >
//           <MainNav />
//           <main>
//             <Container maxWidth="xl" sx={{ py: '64px' }}>
//               {children}
//             </Container>
//           </main>
//         </Box>
//       </Box>
//     </AuthGuard>
//   );
// }
'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';

//import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/dashboard/layout/main-nav';
import { SideNav } from '@/components/dashboard/layout/side-nav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '235px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <Box
        suppressHydrationWarning
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <SideNav />
        <Box
          suppressHydrationWarning
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            pl: { lg: 'var(--SideNav-width)' },
          }}
        >
          <MainNav />
          <main>
            <Container maxWidth="xl" suppressHydrationWarning sx={{ pt: '16px',pb: '64px' }}>
              {children}
            </Container>
          </main>
        </Box>
      </Box>
    </>
  );
}
