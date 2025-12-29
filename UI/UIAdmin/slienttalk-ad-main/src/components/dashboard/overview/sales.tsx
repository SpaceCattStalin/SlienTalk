'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import type { ApexOptions } from 'apexcharts';
import { fetchDashboardData } from '@/service/dashboard';


import { Chart } from '@/components/core/chart';

export interface SalesProps {
  sx?: SxProps;
}

export function Sales({ sx }: SalesProps): React.JSX.Element {
  const [isMounted, setIsMounted] = React.useState(false);
  const [chartSeries, setChartSeries] = useState<{ name: string; data: number[] }[]>([]);
  const chartOptions = useChartOptions();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    async function load() {
      try {
        const data = await fetchDashboardData();

        // API trả đúng 12 tháng nên gán trực tiếp
        setChartSeries([
          {
            name: 'Doanh số theo tháng',
            data: data.subcriptionThisYear
          }
        ]);
      } catch (error) {
        console.error('Lỗi khi tải dashboard:', error);
      }
    }

    load();
  }, [isMounted]);

  return (
    <Card suppressHydrationWarning sx={sx}>
      <CardHeader
        // action={
        //   <Button
        //     color="inherit"
        //     size="small"
        //     startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}
        //   >
        //     Đồng bộ
        //   </Button>
        // }
        title="Doanh số theo tháng"
      />

      <CardContent>
        <Chart
          height={350}
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
        />
      </CardContent>

      <Divider />

      {/* <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
        >
          Overview
        </Button>
      </CardActions> */}
    </Card>
  );
}

function useChartOptions(): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent', stacked: false, toolbar: { show: false } },
    colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    legend: { show: false },
    plotOptions: { bar: { columnWidth: '40px' } },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } }
    },
    yaxis: {
      labels: {
        formatter: (value) => (value > 0 ? `${value}` : `${value}`), // bạn có thể chỉnh nếu muốn
        offsetX: -10,
        style: { colors: theme.palette.text.secondary }
      }
    }
  };
}
