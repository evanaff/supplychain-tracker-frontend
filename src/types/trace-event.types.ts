import type { ActorSnapshot } from './actor.types';
import type { SupplyChainActivity } from './index';
import type { LocationSnapshot } from './location.types';
import type { ProductSnapshot } from './product.types';
import type { TraceProduct, TraceProductSnapshot } from './trace-product.types';

export interface TraceEvent {
    id: string;
    traceProductId: string;

    traceProductJson: TraceProductSnapshot;
    productJson: ProductSnapshot;
    actorJson: ActorSnapshot;
    sourceLocationJson: LocationSnapshot;
    destinationLocationJson: LocationSnapshot | null;

    supplyChainActivity: SupplyChainActivity;
    timestamp: string;

    txHash: string | null;
    isSubmitted: boolean;
}

export interface CreateTraceEventDTO {
  traceProductId: string;
  supplyChainActivity: SupplyChainActivity;
  destinationLocationGln?: string;
}

export interface SubmitEventPayload {
    signature: string;
}

export interface TraceVerificationResult {
    totalEvents: number;
    validEvents: string[];
    invalidEvents: string[];
    missingEvents: string[];
}

export interface EventValidationResult {
    validation: boolean;
}

export interface ProductHistory {
    traceProduct: TraceProduct;
    traceEvents: TraceEvent[];
}