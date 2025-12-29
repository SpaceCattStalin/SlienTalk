import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Tổng quan', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Người dùng', href: paths.dashboard.customers, icon: 'users' },
  { key: 'signwords', title: 'Ngôn ngữ ký hiệu', href: paths.dashboard.signwords, icon: 'signwords' },
  { key: 'paynments', title: 'Quản lý thanh toán', href: paths.dashboard.payments, icon: 'payments' },
  { key: 'plans', title: 'Quản lý gói', href: paths.dashboard.plans, icon: 'card-holder' }
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  //{ key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
