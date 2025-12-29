'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { TextField, Button } from '@mui/material';

// interface FilterProps {
//   keyword: string;
//   onKeywordChange: (v: string) => void;

// }

interface FilterProps {
  keyword: string;
  onKeywordChange: (v: string) => void;
}

// export function PaymentsFilters({ onFilter }: { onFilter: (filter: any) => void; }) {
export function PaymentsFilters({ keyword, onKeywordChange }: FilterProps) {
  //const [keyword, setKeyword] = React.useState('');
  // const [fromDate, setFromDate] = React.useState<string>('');
  // const [toDate, setToDate] = React.useState<string>('');

  // const handleFilter = () => {
  //   onFilter({
  //     keyword,
  //     fromDate: fromDate ? Math.floor(new Date(fromDate).getTime() / 1000) : undefined,
  //     toDate: toDate ? Math.floor(new Date(toDate).getTime() / 1000) : undefined,
  //   });
  // };

  return (
    <Card sx={{ p: 2, display: 'flex', flexDirection: 'row', gap: 2 }}>
      <OutlinedInput
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        fullWidth
        placeholder="Tìm giao dịch"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px', height: '55px' }}
      />

      {/* <div style={{ display: 'flex', gap: '8px' }}>
        <TextField
          type="date"
          label="Từ ngày"
          InputLabelProps={{ shrink: true }}
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <TextField
          type="date"
          label="Đến ngày"
          InputLabelProps={{ shrink: true }}
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <Button variant="contained" onClick={handleFilter}>Lọc</Button>
      </div> */}
    </Card>
  );
}
