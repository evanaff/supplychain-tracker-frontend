import { apiClient } from './client';
import type { PaginatedResponse } from '@/types/api.types';
import type { Product, ProductFilters } from '@/types/product.types';

export const productsApi = {
    list: (params?: ProductFilters) =>
        apiClient.get<PaginatedResponse<{ products: Product[] }>>('/api/products', { params }),
    create: (data: FormData) =>
        apiClient.post<{ status: string; data: { product: Product } }>('/api/products', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }),
};
