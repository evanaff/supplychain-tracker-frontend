import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
    Actor,
    ActorFilters,
    CreateActorPayload,
} from '@/types/actor.types';

export const actorsApi = {
    list: (params?: ActorFilters) =>
        apiClient.get<PaginatedResponse<{ actors: Actor[] }>>('/api/actors', { params }),

    create: (payload: CreateActorPayload) =>
        apiClient.post<ApiResponse<{ actor: Actor }>>('/api/actors', payload),
};
