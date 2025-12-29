'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import api from '@/utils/axiosConfig';
import { type } from '../../../styles/theme/types';

export default function Page(): React.JSX.Element {
  const [pageSize] = React.useState(5);
  const [keyword, setKeyword] = React.useState("");
  const [planFilter, setPlanFilter] = React.useState<string>('Tất cả');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    const fetchSignWords = async () => {
      try {
        const res = await api.get("/api/admin/users", {
          params: {
            Keyword: keyword,
            PlanType: planFilter === "Tất cả" ? null : planFilter,
            CurrentPage: currentPage,
            PageSize: pageSize,
          },
        });

        setUsers(res.data.data);
        setTotalItems(res.data.totalItems);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.log("Get Signwords thất bại", err);
      }
    };

    fetchSignWords();
  }, [keyword, currentPage, planFilter, pageSize]);
  //  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  return (
    <Stack suppressHydrationWarning spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Người dùng</Typography>

        </Stack>
        {/*         
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
         */}
      </Stack>
      <CustomersFilters
        keyword={keyword}
        onKeywordChange={setKeyword}
        type={planFilter}
        onTypeChange={(v) => setPlanFilter(v)}
      />
      <CustomersTable
        count={totalItems}
        page={currentPage - 1}
        rows={users}
        rowsPerPage={pageSize}
        onCurrentPageChange={(newPage) => setCurrentPage(newPage + 1)}
      />
    </Stack>
  );
}

// function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
//   return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
// }
