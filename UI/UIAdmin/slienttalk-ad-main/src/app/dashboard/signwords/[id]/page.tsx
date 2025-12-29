'use client';

import SignwordDetailClient, { SignWordItem as _SignWordItem } from '@/components/dashboard/signword/signword-detail-client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import api from '@/utils/axiosConfig';

type SignWordItem = _SignWordItem;

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  const [item, setItem] = React.useState<SignWordItem | null>(null);

  React.useEffect(() => {
    const fetchSignWord = async () => {
      try {
        const res = await api.get(`/api/admin/signwords/${id}`);

        // Important: axios stores result in res.data, not res
        setItem(res.data);

      } catch (err) {
        console.log("Get Signwords thất bại", err);
      }
    };

    fetchSignWord();

  }, [id]);

  if (!item) {
    return (
      <Stack spacing={3}>
        <Typography variant="h5">Không tìm thấy ký hiệu</Typography>
        <Button variant="outlined" href="/dashboard/signwords">
          Quay lại danh sách
        </Button>
      </Stack>
    );
  }

  return <SignwordDetailClient item={item} />;
}
