"use client";
import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// import { UsersIcon } from '@phosphor-icons/react/dist/ssr/users';
import { Users } from '@phosphor-icons/react/dist/ssr/Users';
import { fetchDashboardData } from '@/service/dashboard';

export interface TasksProgressProps {
  sx?: SxProps;
  value: number;
}

export function TotalAccessToday({ value, sx }: TasksProgressProps): React.JSX.Element {
  const [isMounted, setIsMounted] = React.useState(false);
  const [totalAccessToday, setTotalAccessToday] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    fetchDashboardData()
      .then((data) => {
        const accessValue = data.totalAccessToday.toString();
        setTotalAccessToday(accessValue);
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
                Số lượt truy cập hôm nay
              </Typography>
              <Typography variant="h4">{loading ? 'Đang tải...' : totalAccessToday}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'red', height: '56px', width: '56px' }}>
              {/* <UsersIcon fontSize="var(--icon-fontSize-lg)" /> */}
              <Users size={32} />
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
