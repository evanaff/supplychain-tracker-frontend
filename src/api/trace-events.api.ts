import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type {
    CreateHarvestingPayload,
    CreateReceivingPayload,
    CreateSellingPayload,
    CreateShippingPayload,
    EventValidationResult,
    TraceEvent,
} from '@/types/trace-event.types';

export const traceEventsApi = {
    getById: (id: string) =>
        apiClient.get<ApiResponse<{ traceEvent: TraceEvent }>>(
            `/api/trace-events/${id}`,
        ),

    getEventHash: (id: string) =>
        apiClient.get<ApiResponse<{ dataHash: string, messageHash: string }>>(
            `/api/trace-events/${id}/hash`,
        ),

    saveTxHash: (id: string, txHash: string) =>
        apiClient.post<ApiResponse<void>>(
            `/api/trace-events/${id}/save-txhash`,
            { txHash },
        ),

    verifyOnChain: (id: string) =>
        apiClient.post<ApiResponse<EventValidationResult>>(
            `/api/trace-events/${id}/verify`,
        ),

    createHarvesting: (payload: CreateHarvestingPayload) =>
        apiClient.post<ApiResponse<{ traceEvent: TraceEvent }>>(
            '/api/trace-events/harvesting',
            payload,
        ),

    createShipping: (payload: CreateShippingPayload) =>
        apiClient.post<ApiResponse<{ traceEvent: TraceEvent }>>(
            '/api/trace-events/shipping',
            payload,
        ),

    createReceiving: (payload: CreateReceivingPayload) =>
        apiClient.post<ApiResponse<{ traceEvent: TraceEvent }>>(
            '/api/trace-events/receiving',
            payload,
        ),

    createSelling: (payload: CreateSellingPayload) =>
        apiClient.post<ApiResponse<{ traceEvent: TraceEvent }>>(
            '/api/trace-events/selling',
            payload,
        ),
};
