'use client';

import * as React from 'react';
import type { User } from '@/types/user';
import { logger } from '@/lib/default-logger';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
  setUser?: (user: User | null) => void;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{
    user: User | null;
    error: string | null;
    isLoading: boolean;
  }>({
    user: null,
    error: null,
    isLoading: true,
  });

  // ✅ Hàm setUser ổn định (không đổi qua mỗi render)
  const setUser = React.useCallback((user: User | null) => {
    setState((prev) => ({ ...prev, user }));
  }, []);

  // ✅ Hàm checkSession: chưa có /me → mock user
  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

      if (!token) {
        setState({ user: null, error: null, isLoading: false });
        return;
      }

      // ⚠️ Tạm thời bỏ gọi /api/admin/auth/me vì BE chưa có
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/api/admin/auth/me`, {
      //   method: 'GET',
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // if (!res.ok) {
      //   logger.error(`checkSession failed with status ${res.status}`);
      //   setState({ user: null, error: 'Unauthorized', isLoading: false });
      //   return;
      // }

      // const data = await res.json();

      // ✅ Mock user từ localStorage token (giải pháp DEV)
      setState({
        user: {
          id: 'admin',
          email: 'dev@local.mock',
          firstName: 'Dev',
          lastName: 'Admin',
        } as User,
        error: null,
        isLoading: false,
      });
    } catch (error: any) {
      logger.error('checkSession error:', error);
      setState({
        user: null,
        error: 'Something went wrong',
        isLoading: false,
      });
    }
  }, []);

  // ✅ Gọi checkSession 1 lần khi app khởi động
  React.useEffect(() => {
    checkSession().catch((error) => {
      logger.error(error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ ...state, checkSession, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const UserConsumer = UserContext.Consumer;
