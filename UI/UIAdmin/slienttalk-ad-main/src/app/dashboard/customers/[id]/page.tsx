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
import Chip from '@mui/material/Chip';
import dayjs from 'dayjs';

import api from '@/utils/axiosConfig';

export default function Page({ params }: { params: { id: string; }; }): React.JSX.Element {
  const { id } = params;

  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/admin/users/${id}`);
        setUser(res.data);
      } catch (error) {
        console.log("Get user thất bại", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ mt: 10 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!user) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4">Không tìm thấy người dùng</Typography>
        <Link href="/dashboard/customers">
          <Button variant="outlined">Quay lại danh sách</Button>
        </Link>
      </Stack>
    );
  }

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Chi tiết người dùng
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Link href="/dashboard/customers">
          <Button variant="outlined" sx={{ borderRadius: 2, px: 3, py: 1 }}>
            Trở về
          </Button>
        </Link>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        {/* Avatar + basic info */}
        <Card
          sx={{
            width: 320,
            display: 'flex',
            flexDirection: 'column',
            mx: 3,
            alignItems: 'center',
            p: 6.3,
          }}
        >
          <Avatar
            src={user.imageUrl ?? ''}
            sx={{ width: 100, height: 100, mb: 5.65 }}
          />
          <Typography variant="h5">
            {user.name || 'Không có tên'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Card>

        {/* Detailed Info */}
        <Card sx={{ width: "100%", p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h6" sx={{ mb: 0 }}>
            Thông tin hồ sơ
          </Typography>
          <Divider />

          {/* Name + Phone */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Tên người dùng"
              value={user.name || '—'}
              InputProps={{ readOnly: true }}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Số điện thoại"
              value={user.phoneNumber || '—'}
              InputProps={{ readOnly: true }}
              sx={{ flex: 1 }}
            />
          </Box>

          {/* Email */}
          <TextField
            label="Email"
            value={user.email}
            InputProps={{ readOnly: true }}
          />

          {/* Last opened */}
          <TextField
            label="Lần mở ứng dụng gần nhất"
            value={
              user.lastOpenedAt
                ? dayjs(user.lastOpenedAt).format('DD/MM/YYYY HH:mm')
                : '—'
            }
            InputProps={{ readOnly: true }}
          />

          {/* Total open count */}
          <TextField
            label="Tổng số lần mở ứng dụng"
            value={user.totalAppOpenCount}
            InputProps={{ readOnly: true }}
          />

          {/* Plans */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Gói dịch vụ</Typography>
            <Divider sx={{ my: 1 }} />

            {user.plans?.length === 0 && (
              <Typography>Người dùng chưa có gói nào.</Typography>
            )}

            {user.plans?.map((plan: any) => (
              <Card
                key={plan.userPlanId}
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: '#fafafa',
                  borderRadius: 2,
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1">
                    {plan.name}
                  </Typography>
                  <Chip
                    label={plan.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                    color={plan.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Stack>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Bắt đầu:</strong>{' '}
                  {plan.startDate
                    ? dayjs.unix(plan.startDate).format('DD/MM/YYYY HH:mm')
                    : '—'}
                </Typography>

                <Typography variant="body2">
                  <strong>Kết thúc:</strong>{' '}
                  {plan.endDate
                    ? dayjs.unix(plan.endDate).format('DD/MM/YYYY HH:mm')
                    : 'Không thời hạn'}
                </Typography>

                <Typography variant="body2">
                  <strong>Giá:</strong> {plan.price}₫
                </Typography>
              </Card>
            ))}
          </Box>
        </Card>
      </Box>
    </Stack>
  );
}
