import "./TraceProductInfoCard.css";

interface TraceProductInfoCardProps {
    imageUrl: string;
    productName: string;
    gtin: string;
    quantity: number;
    unitOfMeasure: string;
}

export default function TraceProductInfoCard({
    imageUrl,
    productName,
    gtin,
    quantity,
    unitOfMeasure
}: TraceProductInfoCardProps) {
    return (
        <div className="product-info-card">
            <div className="product-info-image-container">
                <img
                    src={imageUrl}
                    alt={productName}
                    className="product-info-image"
                />
            </div>

            <div className="product-info-content">
                <h3 className="product-info-name">
                    {productName}
                </h3>

                <div className="product-info-grid">
                    <div className="product-info-item">
                        <span className="product-info-label">
                            GTIN
                        </span>

                        <span className="product-info-value">
                            {gtin}
                        </span>
                    </div>

                    <div className="product-info-item">
                        <span className="product-info-label">
                            Quantity
                        </span>

                        <span className="product-info-value">
                            {quantity} {unitOfMeasure}
                        </span>
                    </div>

                    <div className="product-info-item">
                        <span className="product-info-label">
                            Unit of Measure
                        </span>

                        <span className="product-info-value">
                            {unitOfMeasure}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}