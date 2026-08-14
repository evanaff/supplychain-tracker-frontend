import type { Role } from './index';

export interface Actor {
    blockchainAddress: string;
    name: string;
    role: Role;
    location: Location;
}

export interface ActorSnapshot {
    blockchainAddress: string;
    name: string;
    role: Role;
}

export interface ActorFilters {
    page?: number;
    limit?: number;
    filter?: Role | '';
    search?: string;
}

export interface CreateActorPayload {
    blockchainAddress: string;
    locationGln: string;
    name: string;
    role: Exclude<Role, 'ADMIN'>;
}
