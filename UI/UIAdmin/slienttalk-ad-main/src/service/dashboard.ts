// src/services/dashboard.ts
export interface DashboardData {
  totalCustomers: string;
  totalProfit: string;
  totalAccessAllTime: number;
  totalAccessToday: number;
  subcriptionThisYear: number[];
  lastestSubcriptions: {
    id: string;
    userEmail: string;
    date: string;
  }[];
}

// Hàm fetch dữ liệu dashboard
export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch(
    'https://api20251116200831-djh7b7e4dseec6a4.southeastasia-01.azurewebsites.net/api/admin/dashboard'
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: DashboardData = await response.json();
  return data;
}
