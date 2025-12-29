'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';

import { config } from '@/config';
import { SignwordsTable } from '@/components/dashboard/signword/signwords-table';
import { SignwordsFilters } from '@/components/dashboard/signword/signwords-filters';
import type { SignWord } from '@/components/dashboard/signword/signwords-table';

//export const metadata = { title: `Ngôn ngữ ký hiệu | Dashboard | ${config.site.name}` } satisfies Metadata;

import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import api from '@/utils/axiosConfig';
import AddSignwordModal from '@/components/dashboard/signword/add-signword-modal';

export default function Page(): React.JSX.Element {
  const [signWords, setSignWords] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(1);
  const [pageSize] = React.useState(5);
  const [keyword, setKeyword] = React.useState("");
  const [sortBy, setSortBy] = React.useState("name");
  const [isActive, setIsActive] = React.useState<true | false | "Tất cả" | null>("Tất cả");
  const [totalPages, setTotalPages] = React.useState(0);
  const [wordTypeFilter, setWordTypeFilter] = React.useState<string>('Tất cả');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('Tất cả');
  const [openAddModal, setOpenAddModal] = React.useState(false);

  const handleSortChange = (field: string) => {
    if (sortBy === field) setSortBy(`${field}_desc`);
    else setSortBy(field);
  };

  React.useEffect(() => {
    const fetchSignWords = async () => {
      try {

        const res = await api.get("/api/admin/signwords", {
          params: {
            Keyword: keyword,
            IsActive: isActive === "Tất cả" ? null : isActive,
            Category: categoryFilter === "Tất cả" ? "" : categoryFilter,
            WordType: wordTypeFilter === "Tất cả" ? "" : wordTypeFilter,
            SortBy: sortBy,
            CurrentPage: currentPage,
            PageSize: pageSize,
          },
        });

        const formatData = res.data.data.map(item => ({
          ...item,
          createdAt: dayjs(item.createdAt).format("DD/MM/YYYY HH:mm"),
          updatedAt: dayjs(item.updatedAt).format("DD/MM/YYYY HH:mm")
        }));
        setSignWords(formatData);
        setTotalItems(res.data.totalItems);
        // setSignWords(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.log("Get Signwords thất bại", err);
      }
    };

    fetchSignWords();
  }, [keyword, isActive, sortBy, currentPage, categoryFilter, wordTypeFilter, pageSize]);
  //const paginated = signwords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Stack suppressHydrationWarning spacing={3}>
      <Stack spacing={1} sx={{ flex: '1 1 auto', justifyContent: 'space-between', flexDirection: 'row' }}>
        <Typography variant="h4">Ngôn ngữ ký hiệu</Typography>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => setOpenAddModal((prev) => !prev)}
          >
            Thêm từ mới
          </Button>
        </div>
      </Stack>
      <SignwordsFilters
        keyword={keyword}
        onKeywordChange={setKeyword}
        category={categoryFilter}
        onCategoryChange={(v) => {
          setCategoryFilter(v);
        }}
        type={wordTypeFilter}
        onTypeChange={setWordTypeFilter}
        isActive={isActive}
        onIsActiveChange={(v) => setIsActive(v === 'true')}
      />
      <SignwordsTable
        // count={totalPages * pageSize}
        count={totalItems}
        page={currentPage - 1}
        rows={signWords}
        rowsPerPage={pageSize}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onCurrentPageChange={(newPage) => setCurrentPage(newPage + 1)}
      />
      <AddSignwordModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onCreated={() => {
          setCurrentPage(1); 
        }}
      />
    </Stack>
  );
}

