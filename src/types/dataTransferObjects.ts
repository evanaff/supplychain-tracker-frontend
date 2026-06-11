import { type Role, type SupplyChainActivity } from "./types";

// Actors
export interface CreateActorDTO {
  blockchainAddress: string;
  locationGln: string;
  name: string;
  role: Role;
};

export interface ListActorsQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  filter?: Role;
};

export interface EditActorDTO {
  name: string;
  role: Role;
};

// Locations
export interface CreateLocationDTO {
  gln: string;
  name: string;
  province: string;
  city: string;
  address: string;
};

export interface ListLocationsQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
}

export interface EditLocationDTO {
  name: string;
  province: string;
  city: string;
  address: string;
};

// Trace Products
export interface CreateTraceProductDTO {
  gtin: string;
  quantity: number;
};

export interface ListTraceProductsQueryDTO {
    page?: number;
    limit?: number;
    search?: string;
    filter?: SupplyChainActivity | "CREATED"
};

// Trace Events
export interface CreateTraceEventDTO {
  traceProductId: string;
  destinationLocationGln?: string;
};

export interface SubmitTraceEventDTO {
  signature: string;
};

// Products
export interface ListProductsQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
}