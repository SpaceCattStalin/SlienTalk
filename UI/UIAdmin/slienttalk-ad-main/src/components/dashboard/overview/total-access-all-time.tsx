"use client"
import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { UsersThreeIcon } from '@phosphor-icons/react/dist/ssr/UsersThree';
import { fetchDashboardData } from '@/service/dashboard';

export interface TasksProgressProps {
  sx?: SxProps;
  value: number;
}

export function TotalAccessAllTime({ value, sx }: TasksProgressProps): React.JSX.Element {
      const [isMounted, setIsMounted] = React.useState(false);
      const [totalAccessAllTime, setTotalAccessAllTime] = useState<string>('0');
      const [loading, setLoading] = useState<boolean>(true);

      useEffect(() => {
        setIsMounted(true);
      }, []);

      useEffect(() => {
        if (!isMounted) return;

        fetchDashboardData()
          .then((data) => {
            const accessValue = data.totalAccessAllTime.toString();
            setTotalAccessAllTime(accessValue);
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }, [isMounted]);
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack suppressHydrationWarning spacing={2}>
          <Stack suppressHydrationWarning direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" gutterBottom variant="overline">
                Tổng số lượt truy cập
              </Typography>
              <Typography variant="h4">{loading ? 'Đang tải...' : totalAccessAllTime}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-warning-main)', height: '56px', width: '56px' }}>
              <UsersThreeIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
          {/* <div>
            <LinearProgress value={value} variant="determinate" />
          </div> */}
        </Stack>
      </CardContent>
    </Card>
  );
}
