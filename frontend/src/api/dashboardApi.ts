import { client } from "./client";

export interface SalesStat {
  data: string;
  revenue: number;
}

export interface DashboardStats {
  chartData: SalesStat[];
  totalRevenue: number;
}

export const getDashboardStats = async (period: string = 'daily'): Promise<DashboardStats> => {
  const response = await client.get<DashboardStats>(`/orders/stats?period=${period}`);
  return response.data;
};