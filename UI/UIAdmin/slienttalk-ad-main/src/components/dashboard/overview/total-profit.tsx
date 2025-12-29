"use client"
import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { MoneyIcon } from '@phosphor-icons/react/dist/ssr/Money';
import { fetchDashboardData } from '@/service/dashboard';

export interface TotalProfitProps {
  sx?: SxProps;
  value: string;
}

export function TotalProfit({ value, sx }: TotalProfitProps): React.JSX.Element {
  const [isMounted, setIsMounted] = React.useState(false);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    fetchDashboardData()
      .then((data) => {
        const profitValue = parseFloat(data.totalProfit);
        if (!isNaN(profitValue)) {
          setTotalProfit(profitValue);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isMounted]);

      const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack suppressHydrationWarning direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Tổng lợi nhuận
            </Typography>
            <Typography variant="h4">{loading ? 'Đang tải...' : formatCurrency(totalProfit)}</Typography>
          </Stack>
          <Avatar sx={{ backgroundColor: 'var(--mui-palette-success-main)', height: '56px', width: '56px' }}>
            <MoneyIcon fontSize="var(--icon-fontSize-lg)" />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}
