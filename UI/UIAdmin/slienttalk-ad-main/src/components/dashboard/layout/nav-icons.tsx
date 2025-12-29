import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { HandPalmIcon } from '@phosphor-icons/react/dist/ssr/HandPalm';
import { UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { CoinsIcon } from '@phosphor-icons/react/dist/ssr/Coins';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';
import { Cardholder } from '@phosphor-icons/react/dist/ssr/Cardholder';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  'card-holder': Cardholder,
  user: UserIcon,
  users: UsersIcon,
  'signwords': HandPalmIcon,
  'payments': CoinsIcon,
} as Record<string, Icon>;
