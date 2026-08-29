import type { SupplyChainActivity } from ".";
import type { Actor } from "./actor.types";
import type { Product } from "./product.types";

export interface ProductLot {
    id: string;
    lotNumber: string;
    quantity: number;
    currentActivity: SupplyChainActivity | 'CREATED';
    createdAt: string;

    product: Product;
    owner: Actor;
}

export interface ProductLotSnapshot {
    id: string;
    lotNumber: string;
    quantity: number;
}

export interface ProductLotFilters {
    page?: number;
    limit?: number;
    search?: string;
    filter?: SupplyChainActivity | '';
}

export interface CreateProductLotPayload {
    gtin: string;
    quantity: number;
}