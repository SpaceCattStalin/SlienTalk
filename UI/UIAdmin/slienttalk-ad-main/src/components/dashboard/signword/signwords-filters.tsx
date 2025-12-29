import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { CATEGORIES, WORD_TYPES } from './signwords-table';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';


interface FilterProps {
  keyword: string;
  onKeywordChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  type: string;
  onTypeChange: (v: string) => void;
  isActive: string;
  onIsActiveChange: (v: string) => void;
}


export function SignwordsFilters({ keyword,
  onKeywordChange,
  category,
  onCategoryChange,
  type,
  onTypeChange,
  isActive,
  onIsActiveChange
}: FilterProps): React.JSX.Element {
  return (
    <Card sx={{ p: 2, display: 'flex', justifyContent: 'flex-start', gap: 4 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="Tìm ký hiệu"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px', height: '40px' }}
      />

      <FormControl sx={{ minWidth: 160 }} size='small'>
        <InputLabel>Chủ đề</InputLabel>
        <Select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          label="Chủ đề"
        >
          <MenuItem key={0} value="Tất cả">Tất cả</MenuItem>
          {CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 160 }} size='small'>
        <InputLabel>Loại từ</InputLabel>
        <Select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          label="Loại từ"
        >
          <MenuItem key={0} value="Tất cả">Tất cả</MenuItem>
          {WORD_TYPES.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 160 }} size='small'>
        <InputLabel>Trạng thái</InputLabel>
        <Select
          value={isActive}
          onChange={(e) => onIsActiveChange(e.target.value)}
          label="Trạng thái"
        >
          <MenuItem value="Tất cả">Tất cả</MenuItem>
          <MenuItem value="true">Hoạt động</MenuItem>
          <MenuItem value="false">Không hoạt động</MenuItem>
        </Select>
      </FormControl>
    </Card>
  );
}
