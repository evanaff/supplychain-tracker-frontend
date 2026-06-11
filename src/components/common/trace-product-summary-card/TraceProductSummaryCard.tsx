import type { TraceProduct } from "../../../types/types";
import { timestampToDate } from "../../../utils";
import "./TraceProductSummaryCard.css";

interface TraceProductSummaryCardProps {
    // traceProductId: string;
    // currentStatus: string;
    // lotNumber: string;
    // createdAt: string;
    traceProduct: TraceProduct
}

export default function TraceProductSummaryCard({
    // traceProductId,
    // currentStatus,
    // lotNumber,
    // createdAt,
    traceProduct
}: TraceProductSummaryCardProps) {
    return (
        <div className="product-summary-card">
            <h3 className="product-summary-title">
                Trace Product Summary
            </h3>

            <div className="product-summary-field">
                <span className="product-status-badge">
                    {traceProduct.currentActivity}
                </span>
            </div>

            <div className="product-summary-field">
                <span className="product-summary-label">
                    Trace Product ID
                </span>

                <span className="product-summary-value">
                    {traceProduct.id}
                </span>
            </div>

            <div className="product-summary-field">
                <span className="product-summary-label">
                    Lot Number
                </span>

                <span className="product-summary-value">
                    {traceProduct.lotNumber}
                </span>
            </div>

            <div className="product-summary-field">
                <span className="product-summary-label">
                    Created At
                </span>

                <span className="product-summary-value">
                    {timestampToDate(traceProduct.createdAt)}
                </span>
            </div>
        </div>
    );
}