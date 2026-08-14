import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
    CreateLocationPayload,
    Location,
    LocationFilters,
} from '@/types/location.types';

export const locationsApi = {
    list: (params?: LocationFilters) =>
        apiClient.get<PaginatedResponse<{ locations: Location[] }>>('/api/locations', { params }),

    create: (payload: CreateLocationPayload) =>
        apiClient.post<ApiResponse<{ location: Location }>>('/api/locations', payload),
};
