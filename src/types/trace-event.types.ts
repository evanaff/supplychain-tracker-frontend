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
    isRecorded: boolean;
}

export interface CreateHarvestingPayload {
    traceProductId: string;
}

export interface CreateShippingPayload {
    traceProductId: string;
    destinationLocationGln: string;
}

export interface CreateReceivingPayload {
    traceProductId: string;
}

export interface CreateSellingPayload {
    traceProductId: string;
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

export interface TraceHistory {
    traceProduct: TraceProduct;
    traceEvents: TraceEvent[];
}