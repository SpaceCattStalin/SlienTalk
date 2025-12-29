'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import { paths } from '@/paths';
import { useUser } from '@/hooks/use-user';
import { logger } from '@/lib/default-logger';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  React.useEffect(() => {
    if (isLoading) return;
    if (!user) {
      logger.debug('[AuthGuard]: Not logged in, redirecting...');
      router.replace(paths.auth.signIn);
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (error) return <Alert color="error">{error}</Alert>;
  if (!user) return null;

  return <>{children}</>;
}
