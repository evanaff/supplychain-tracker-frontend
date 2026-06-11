// Tyoes
export type Role = "GROWER" | "DISTRIBUTOR" | "RETAILER" | "ADMIN";
export type ExecutorRole = "GROWER" | "DISTRIBUTOR" | "RETAILER";
export type SupplyChainActivity = "HARVESTING" | "SHIPPING" | "RECEIVING" | "SELLING";
export type ValidationStatus = "PENDING" | "VALID" | "INVALID";

// Interfaces
export interface Location {
    gln: string;
    name: string;
    province: string;
    city: string;
    address: string;
}

export interface Actor {
    blockchainAddress: string;
    name: string;
    role: Role;
    location: Location
}

export interface Product {
    gtin: string,
    varietyName: string,
    unitOfMeasure: string,
    imageUrl: string
}

export interface TraceProduct {
    id: string;
    lotNumber: string;
    quantity: number;
    currentActivity: SupplyChainActivity;
    createdAt: string;

    product: Product
    owner: Actor
}

export interface TraceEvent {
    id: string;
    supplyChainActivity: SupplyChainActivity;
    timestamp: string;
    destinationLocation?: Location;
    validationStatus: ValidationStatus;
    txHash: string; 

    actor: Actor,
    traceProduct: TraceProduct
}

export interface DashboardStats {
    totalGrowers: number;
    totalDistributors: number;
    totalRetailers: number;
    totalLocations: number;
}