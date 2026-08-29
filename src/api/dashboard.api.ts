import type { ApiResponse } from '@/types/api.types';
import { apiClient } from './client';
import type { DashboardData } from '@/types/dashboard.types';

export const dashboardApi = {
    getDashboardData: () =>
        apiClient.get<ApiResponse<DashboardData>>('/api/dashboard'),
};