import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type {
    CreateTraceEventDTO,
    TraceEvent,
} from '@/types/trace-event.types';

export const traceEventsApi = {
    getEventHash: (id: string) =>
        apiClient.get<ApiResponse<{ dataHash: string, messageHash: string }>>(
            `/api/trace-events/${id}/hash`,
        ),

    saveTxHash: (id: string, txHash: string) =>
        apiClient.post<ApiResponse<void>>(
            `/api/trace-events/${id}/save-txhash`,
            { txHash },
        ),

    create: (payload: CreateTraceEventDTO) =>
        apiClient.post<ApiResponse<{ traceEvent: TraceEvent }>>(
        '/api/trace-events',
      payload,
    ),
};
