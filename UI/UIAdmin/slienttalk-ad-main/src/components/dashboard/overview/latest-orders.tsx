'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';

import { fetchDashboardData } from '@/service/dashboard';

export interface LatestOrdersProps {
  sx?: SxProps;
}

export function LatestOrders({ sx }: LatestOrdersProps): React.JSX.Element {
  const [isMounted, setIsMounted] = React.useState(false);
  const [orders, setOrders] = useState<
    { id: string; userEmail: string; date: string }[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    async function load() {
      try {
        const data = await fetchDashboardData();
        setOrders(data.lastestSubcriptions);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isMounted]);

  return (
    <Card suppressHydrationWarning sx={sx}>
      <CardHeader title="Danh sách thanh toán gần nhất" />
      <Divider />

      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 200 }}>
          <TableHead>
            <TableRow><TableCell>Địa chỉ Email</TableCell><TableCell>Ngày đăng ký</TableCell><TableCell>Thao tác</TableCell></TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3}>Đang tải...</TableCell></TableRow>
            ) : (
              orders.map((item) => (
                <TableRow hover key={item.id}><TableCell>{item.userEmail}</TableCell><TableCell>{dayjs(item.date).format('DD/MM/YYYY')}</TableCell><TableCell><Button variant="outlined" size="small" href={`/dashboard/payments/${item.id}`}>Chi tiết</Button></TableCell></TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

      <Divider />
      {/* <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions> */}
    </Card>
  );
}
