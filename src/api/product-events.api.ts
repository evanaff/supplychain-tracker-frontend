import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type {
    CreateProductEventDTO,
    ProductEvent,
} from '@/types/product-event.types';

export const productEventsApi = {
    getEventHash: (id: string) =>
        apiClient.get<ApiResponse<{ dataHash: string, messageHash: string }>>(
            `/api/product-events/${id}/hash`,
        ),

    saveTxHash: (id: string, txHash: string) =>
        apiClient.post<ApiResponse<void>>(
            `/api/product-events/${id}/save-txhash`,
            { txHash },
        ),

    create: (payload: CreateProductEventDTO) =>
        apiClient.post<ApiResponse<{ productEvent: ProductEvent }>>(
        '/api/product-events',
      payload,
    ),
};
