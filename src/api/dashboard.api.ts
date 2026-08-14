import type { ApiResponse } from '@/types/api.types';
import { apiClient } from './client';
import type { DashboardStats } from '@/types/dashboard.types';

export const dashboardApi = {
    getAdminStats: () =>
        apiClient.get<ApiResponse<DashboardStats>>('/api/dashboard'),
};