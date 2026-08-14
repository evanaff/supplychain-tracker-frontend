import type { SupplyChainActivity } from ".";
import type { Actor } from "./actor.types";
import type { Product } from "./product.types";

export interface TraceProduct {
    id: string;
    lotNumber: string;
    quantity: number;
    currentActivity: SupplyChainActivity | 'CREATED';
    createdAt: string;

    product: Product;
    owner: Actor;
}

export interface TraceProductSnapshot {
    id: string;
    lotNumber: string;
    quantity: number;
}

export interface TraceProductFilters {
    page?: number;
    limit?: number;
    search?: string;
    filter?: SupplyChainActivity | '';
}

export interface CreateTraceProductPayload {
    gtin: string;
    quantity: number;
}