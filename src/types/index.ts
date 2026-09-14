// Auth
export interface AuthActor {
  address: string;
  name: string;
  role: Role;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  actor: AuthActor | null;
  isAuthenticated: boolean;
}

export interface SiweMessagePayload {
  domain: string;
  address: string;
  uri: string;
  version: string;
  chainId: number;
}

// Location
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

// Actor
export interface Actor {
    blockchainAddress: string;
    name: string;
    role: Role;
    location: Location;
    txHash?: string;
}

export interface ActorSnapshot {
    blockchainAddress: string;
    name: string;
    role: Role;
}

// Product
export interface Product {
    gtin: string;
    varietyName: string;
    unitOfMeasure: string;
    imageUrl: string;
}

export interface ProductSnapshot {
    gtin: string;
    varietyName: string;
    unitOfMeasure: string;
}

// Product Lot & Event
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

export interface ProductEvent {
    id: string;
    productLotId: string;

    productLotJson: ProductLotSnapshot;
    productJson: ProductSnapshot;
    actorJson: ActorSnapshot;
    sourceLocationJson: LocationSnapshot;
    destinationLocationJson: LocationSnapshot | null;

    supplyChainActivity: SupplyChainActivity;
    timestamp: string;

    txHash: string | null;
}

export interface VerificationResult {
    totalEvents: number;
    validEvents: string[];
    invalidEvents: string[];
    unrecordedEvents: string[];
    missingEvents: string[];
}

export interface ProductHistory {
    productLot: ProductLot;
    productEvents: ProductEvent[];
}

// etc
export type Role = "GROWER" | "DISTRIBUTOR" | "RETAILER" | "ADMIN";

export type SupplyChainActivity = "HARVESTING" | "SHIPPING" | "RECEIVING" | "SELLING";

export interface DashboardData {
    totalGrowers: number;
    totalDistributors: number;
    totalRetailers: number;
    totalLocations: number;
    totalProducts: number,
    totalProductLots: number
}