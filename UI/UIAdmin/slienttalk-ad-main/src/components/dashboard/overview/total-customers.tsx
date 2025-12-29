"use client"
import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { fetchDashboardData } from '@/service/dashboard';


export interface TotalCustomersProps {
  diff?: number;
  trend: 'up' | 'down';
  sx?: SxProps;
  value: string;
}

export function TotalCustomers({ diff, trend, sx, value }: TotalCustomersProps): React.JSX.Element {
  const [isMounted, setIsMounted] = React.useState(false);
  const [totalCustomers, setTotalCustomers] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);
  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const trendColor = trend === 'up' ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    fetchDashboardData()
      .then((data) => setTotalCustomers(data.totalCustomers))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isMounted]);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack suppressHydrationWarning spacing={2}>
          <Stack suppressHydrationWarning direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Tổng số người dùng
              </Typography>
              <Typography variant="h4">{loading ? 'Đang tải...' : totalCustomers}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'grey', height: '56px', width: '56px' }}>
              <UserIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
          {/* {diff ? (
            <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
              <Stack sx={{ alignItems: 'center' }} direction="row" spacing={0.5}>
                <TrendIcon color={trendColor} fontSize="var(--icon-fontSize-md)" />
                <Typography color={trendColor} variant="body2">
                  {diff}%
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="caption">
                Since last month
              </Typography>
            </Stack>
          ) : null} */}
        </Stack>
      </CardContent>
    </Card>
  );
}
