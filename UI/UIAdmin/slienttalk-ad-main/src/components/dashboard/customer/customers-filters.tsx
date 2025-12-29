import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export const PLAN_TYPES = ['FREE', "PREMIUM"] as const;

interface FilterProps {
  keyword: string;
  onKeywordChange: (v: string) => void;
  type: string;
  onTypeChange: (v: string) => void;
}
export function CustomersFilters(
  {
    keyword,
    onKeywordChange,
    onTypeChange,
    type
  }: FilterProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2, display: 'flex', justifyContent: 'flex-start', gap: 4 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="Tìm người dùng"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px', height: '40px' }}
      />
      <FormControl sx={{ minWidth: 160 }} size='small'>
        <InputLabel>Gói</InputLabel>
        <Select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          label="Gói"
        >
          <MenuItem key={0} value="Tất cả">Tất cả</MenuItem>
          {PLAN_TYPES.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Card>
  );
}
