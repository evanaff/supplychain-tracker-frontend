import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type { ProductHistory, VerificationResult } from '@/types/product-event.types';
import type {
    CreateProductLotPayload,
    ProductLot,
    ProductLotFilters,
} from '@/types/product-lot.types';

export const productLotsApi = {
    list: (params?: ProductLotFilters) =>
        apiClient.get<PaginatedResponse<{ productLots: ProductLot[] }>>(
            '/api/product-lots',
            { params },
        ),

    create: (payload: CreateProductLotPayload) =>
        apiClient.post<ApiResponse<{ productLot: ProductLot }>>(
            '/api/product-lots',
            payload,
        ),

    getHistory: (id: string) =>
        apiClient.get<ApiResponse<ProductHistory>>(`/api/product-lots/${id}`),

    verify: (id: string) =>
        apiClient.post<ApiResponse<VerificationResult>>(
            `/api/product-lots/${id}/verify`,
        ),
};