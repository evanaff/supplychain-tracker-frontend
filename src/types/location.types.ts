import type { Role } from './index';

export type AllowedRole = Exclude<Role, 'ADMIN'>;

export interface Location {
    gln: string;
    name: string;
    province: string;
    city: string;
    address: string;
    allowedRole: Role;
}

export interface LocationSnapshot {
    gln: string;
    name: string;
    province: string;
    city: string;
    address: string;
}

export interface LocationFilters {
    page?: number;
    limit?: number;
    search?: string;
    filter?: string;
}

export interface CreateLocationPayload {
    gln: string;
    name: string;
    province: string;
    city: string;
    address: string;
    allowedRole: AllowedRole;
}
