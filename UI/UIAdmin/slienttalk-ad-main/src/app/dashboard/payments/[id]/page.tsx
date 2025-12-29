'use client';

import * as React from 'react';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import api from '@/utils/axiosConfig';
import { Chip } from '@mui/material';

interface Props {
  params: { id: string; };
}

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface Plan {
  planId: string;
  name: string;
  price: number;
  currency: string;
  durationDays: number;
}

interface Payment {
  paymentId: string;
  userPlanId: string;
  user: User;
  plan: Plan;
  amount: number;
  currency: string;
  status: number;
  paymentMethod: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function PaymentDetailPage({ params }: { params: { id: string; }; }) {
  const { id } = params;

  const [payment, setPayment] = React.useState<Payment | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await api.get(`/api/admin/payments/${id}`);
        setPayment(res.data);
      } catch (err) {
        console.error("Failed to fetch payment", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  if (loading) {
    return (
      <Stack spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
        <CircularProgress />
        <Typography>Đang tải dữ liệu thanh toán...</Typography>
      </Stack>
    );
  }

  if (!payment) {
    return (
      <Stack spacing={2} sx={{ mt: 4 }}>
        <Typography variant="h5">Không tìm thấy thanh toán</Typography>
        <Link href="/dashboard/payments">
          <Button variant="outlined">Quay lại danh sách</Button>
        </Link>
      </Stack>
    );
  }

  const { user, plan } = payment;

  return (
    <Stack spacing={3} sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Chi tiết thanh toán</Typography>
        <Link href="/dashboard/payments">
          <Button variant="outlined" sx={{ borderRadius: 2, px: 3, py: 1 }}>Quay lại</Button>
        </Link>
      </Stack>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
        {/* User Info */}
        <Card sx={{ width: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 6 }}>
          <Avatar sx={{ width: 100, height: 100, mb: 4 }}>
            {user && user.name ? user.name[0] : ''}
          </Avatar>
          <Typography variant="h5">{user?.name}</Typography>
          <TextField
            label="Email"
            value={user.email}
            InputProps={{ readOnly: true }}
            sx={{ mt: 2, width: '100%' }}
          />
          <TextField
            label="Số điện thoại"
            value={user?.phoneNumber}
            InputProps={{ readOnly: true }}
            sx={{ mt: 2, width: '100%' }}
          />
        </Card>

        <Card sx={{ width: 400, p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6">Gói đăng ký</Typography>
          <Divider />
          <TextField
            label="Tên gói"
            value={plan.name}
            InputProps={{ readOnly: true }}
            sx={{ width: '100%' }}
          />
          <TextField
            label="Giá"
            value={`${plan.price.toLocaleString()} ${plan.currency}`}
            InputProps={{ readOnly: true }}
            sx={{ width: '100%' }}
          />
          <TextField
            label="Thời hạn (ngày)"
            value={plan.durationDays}
            InputProps={{ readOnly: true }}
            sx={{ width: '100%' }}
          />
        </Card>

        {/* Payment Info */}
        <Card sx={{ width: 400, p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6">Thông tin thanh toán</Typography>
          <Divider />
          {/* <TextField
            label="ID Thanh toán"
            value={payment.paymentId}
            InputProps={{ readOnly: true }}
            sx={{ width: '100%' }}
          /> */}
          <TextField
            label="Phương thức thanh toán"
            value={payment.paymentMethod}
            InputProps={{ readOnly: true }}
            sx={{ width: '100%' }}
          />
          <TextField
            label="Số tiền"
            value={`${payment.amount.toLocaleString()} ${payment.currency}`}
            InputProps={{ readOnly: true }}
            sx={{ width: '100%' }}
          />
          <TextField
            label="Ngày thanh toán"
            value={new Date(payment.paymentDate).toLocaleString()}
            InputProps={{ readOnly: true }}
            sx={{ width: '100%' }}
          />


          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>Trạng thái</Typography>
            {payment.status === 1 ? (
              <Chip label="Thành công" color="success" size="small" />
            ) : (
              <Chip label="Thất bại" color="error" size="small" />
            )}
          </Box>
        </Card>
      </Box>
    </Stack>
  );
}
