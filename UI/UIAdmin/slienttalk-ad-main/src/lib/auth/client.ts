'use client';

import axios from 'axios';
import type { User } from '@/types/user';

const API_ROOT =
  process.env.NEXT_PUBLIC_API_ROOT ||
  'https://api20251116200831-djh7b7e4dseec6a4.southeastasia-01.azurewebsites.net';

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export class AuthClient {
  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    try {
      const res = await axios.post(`${API_ROOT}/api/admin/auth/login`, {
        email: params.email,
        password: params.password,
      });

      // ✅ lưu token vào localStorage
      const { accessToken, refreshToken } = res.data;
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      return {};
    } catch (err: any) {
      console.error('Login error:', err);
      return { error: err.response?.data?.message || 'Đăng nhập thất bại.' };
    }
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return { data: null };

      const res = await axios.get(`${API_ROOT}/api/admin/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { data: res.data };
    } catch (err: any) {
      console.error('GetUser error:', err);
      return { data: null, error: err.response?.data?.message || 'Không được cấp quyền.' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      const token = localStorage.getItem('refreshToken');
      await axios.post(`${API_ROOT}/api/admin/auth/revoke`, token ? { refreshToken: token } : {});
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    return {};
  }

  async signUp(values: { name?: string; email: string; password: string }): Promise<{ error?: string }> {
    try {
      await axios.post(`${API_ROOT}/api/admin/auth/register`, values);
      return {};
    } catch (err: any) {
      console.error('SignUp error:', err);
      return { error: err.response?.data?.message || 'Đăng ký thất bại.' };
    }
  }

  async resetPassword(values: { email: string }): Promise<{ error?: string }> {
    try {
      await axios.post(`${API_ROOT}/api/admin/auth/reset-password`, values);
      return {};
    } catch (err: any) {
      console.error('ResetPassword error:', err);
      return { error: err.response?.data?.message || 'Lấy lại mật khẩu thất bại.' };
    }
  }
}

export const authClient = new AuthClient();
