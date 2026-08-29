import type { ActorSnapshot } from './actor.types';
import type { SupplyChainActivity } from './index';
import type { LocationSnapshot } from './location.types';
import type { ProductSnapshot } from './product.types';
import type { ProductLot, ProductLotSnapshot } from './product-lot.types';

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
    isSubmitted: boolean;
}

export interface CreateProductEventDTO {
  productLotId: string;
  supplyChainActivity: SupplyChainActivity;
  destinationLocationGln?: string;
}

export interface SubmitEventPayload {
    signature: string;
}

export interface VerificationResult {
    totalEvents: number;
    validEvents: string[];
    invalidEvents: string[];
    missingEvents: string[];
}

export interface EventValidationResult {
    validation: boolean;
}

export interface ProductHistory {
    productLot: ProductLot;
    productEvents: ProductEvent[];
}