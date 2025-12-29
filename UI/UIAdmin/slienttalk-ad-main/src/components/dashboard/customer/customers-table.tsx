'use client';

import * as React from 'react';
// Avatar hidden in list; show only on detail page
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// import Checkbox from '@mui/material/Checkbox';
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

import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export interface Customer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  address: { city: string; state: string; country: string; street: string; };
  phone: string;
  createdAt: Date;
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
  onCurrentPageChange: (page: number) => void;
}

export function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onCurrentPageChange
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>{/*
              <TableCell padding="checkbox">
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
              </TableCell>
              */}<TableCell>STT</TableCell><TableCell>Email</TableCell><TableCell>Tên</TableCell><TableCell>Số điện thoại</TableCell><TableCell align="right">Thao tác</TableCell></TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>{/*
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  */}<TableCell>{page * rowsPerPage + index + 1}</TableCell><TableCell>{row.email}</TableCell><TableCell><Link href={`/dashboard/customers/${row.id}`} style={{ textDecoration: 'none', color: 'inherit' }}><Typography variant="subtitle2">{row.name ?? '_'}</Typography></Link></TableCell><TableCell>{row.phone ?? '_'}</TableCell><TableCell align="right"><Link href={`/dashboard/customers/${row.id}`}><Button variant="outlined" size="small">Chi tiết</Button></Link></TableCell></TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={(event, newPage) => {
          onCurrentPageChange(newPage);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
        labelDisplayedRows={({ from, to, count }) => {
          return `Từ ${from} đến ${to} trên tổng số ${count !== -1 ? count : 'nhiều'}`;
        }}
      />
    </Card>
  );
}
