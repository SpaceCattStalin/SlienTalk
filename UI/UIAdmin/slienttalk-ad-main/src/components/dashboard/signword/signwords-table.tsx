"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import dayjs from 'dayjs';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useState } from 'react';

import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export const WORD_TYPES = ['Chữ cái', 'Cụm từ nghi vấn', 'Danh từ', 'Động từ'] as const;
export const CATEGORIES = ['Câu hỏi', 'Chữ cái', 'Gia đình', 'Trường học'] as const;

export interface SignWord {
  signWordId: string;
  word: string;
  definition: string;
  wordType: typeof WORD_TYPES[number];
  exampleSentence: string;
  category: typeof CATEGORIES[number];
  signWordUri: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SignWordsTableProps {
  count?: number;
  page?: number;
  rows?: SignWord[];
  rowsPerPage?: number;
  sortBy?: string;
  onSortChange?: (field: string) => void;
  onCurrentPageChange: (page: number) => void;
}

export function SignwordsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  sortBy,
  onSortChange,
  onCurrentPageChange
}: SignWordsTableProps): React.JSX.Element {
  const [wordTypeFilter, setWordTypeFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const rowIds = React.useMemo(() => {
    return rows.map((signword) => signword.signWordId);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        {/* <Table sx={{ minWidth: '1200px' }}> */}
        <Table sx={{ minWidth: '100%', }}>
          <TableHead>
            <TableRow>{/* <TableCell padding="checkbox" sx={{ width: 60 }}>
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell> */}<TableCell sx={{ width: 220, cursor: "pointer" }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Ký hiệu
                </Typography>
              </TableCell><TableCell sx={{ width: 160, textAlign: 'center', cursor: 'pointer' }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Loại từ
                </Typography>
              </TableCell><TableCell sx={{ width: 160, textAlign: 'center', cursor: 'pointer' }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Chủ đề
                </Typography>
              </TableCell><TableCell sx={{ width: 160, textAlign: 'center' }}><Typography variant="subtitle2" fontWeight={600}>Trạng thái hoạt động</Typography></TableCell><TableCell sx={{ width: 160, textAlign: 'center' }}><Typography variant="subtitle2" fontWeight={600}>Ngày tạo</Typography></TableCell><TableCell sx={{ width: 160, textAlign: 'center' }}><Typography variant="subtitle2" fontWeight={600}>Ngày cập nhật</Typography></TableCell><TableCell align="right" sx={{ width: 120 }}><Typography variant="subtitle2" fontWeight={600}>Thao tác</Typography></TableCell></TableRow>
          </TableHead>
          <TableBody>
            {rows.filter(row => {
              const matchWordType = !wordTypeFilter || row.wordType === wordTypeFilter;
              const matchCategory = !categoryFilter || row.category === categoryFilter;
              return matchWordType && matchCategory;
            }).map((row, idx) => {
              const isSelected = selected?.has(row.signWordId);
              return (
                <TableRow hover key={row.signWordId || idx} selected={isSelected}>{/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.signWordId);
                        } else {
                          deselectOne(row.signWordId);
                        }
                      }}
                    />
                  </TableCell> */}<TableCell>
                    <Link href={`/dashboard/signwords/${row.signWordId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography variant="subtitle2">{row.word}</Typography>
                    </Link>
                  </TableCell><TableCell align="center"><Typography variant="subtitle2">{row.wordType}</Typography></TableCell><TableCell align="center"><Typography variant="subtitle2">{row.category}</Typography></TableCell><TableCell align="center">
                    <Checkbox
                      checked={row.isActive}
                      disabled
                    />
                  </TableCell><TableCell align="center"><Typography variant="subtitle2">{typeof row.createdAt === 'object' ? dayjs(row.createdAt).format('YYYY-MM-DD HH:mm') : row.createdAt}</Typography></TableCell><TableCell align="center"><Typography variant="subtitle2">{typeof row.updatedAt === 'object' ? dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm') : row.updatedAt}</Typography></TableCell><TableCell align="right">
                    <Link href={`/dashboard/signwords/${row.signWordId}`}>
                      <Button variant="outlined" size="small">Chi tiết</Button>
                    </Link>
                  </TableCell></TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        onPageChange={(event, newPage) => {
          onCurrentPageChange(newPage);
        }}
        page={page}
        rowsPerPageOptions={[]}
        labelDisplayedRows={({ from, to, count }) => {
          return `Từ ${from} đến ${to} trên tổng số ${count !== -1 ? count : 'nhiều'}`;
        }}
      />
    </Card>
  );
}
