import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type { TraceHistory, TraceVerificationResult } from '@/types/trace-event.types';
import type {
    CreateTraceProductPayload,
    TraceProduct,
    TraceProductFilters,
} from '@/types/trace-product.types';

export const traceProductsApi = {
    list: (params?: TraceProductFilters) =>
        apiClient.get<PaginatedResponse<{ traceProducts: TraceProduct[] }>>(
            '/api/trace-products',
            { params },
        ),

    getById: (id: string) =>
        apiClient.get<ApiResponse<{ traceProduct: TraceProduct }>>(
            `/api/trace-products/${id}`,
        ),

    create: (payload: CreateTraceProductPayload) =>
        apiClient.post<ApiResponse<{ traceProduct: TraceProduct }>>(
            '/api/trace-products',
            payload,
        ),

    // Public — no auth required
    getHistory: (id: string) =>
        apiClient.get<ApiResponse<TraceHistory>>(`/api/trace-products/${id}/history`),

    // Public — no auth required
    verify: (id: string) =>
        apiClient.post<ApiResponse<TraceVerificationResult>>(
            `/api/trace-products/${id}/verify`,
        ),
};