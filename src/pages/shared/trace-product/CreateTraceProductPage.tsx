import "./CreateTraceProductPage.css";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import RoleLayout from "../../../layouts/RoleLayout";
import PageHeader from "../../../components/layout/page-header/PageHeader";
import Button from "../../../components/common/button/Button";
import { listProducts } from "../../../api/productApi";
import type { Product } from "../../../types/types";
import { createTraceProduct } from "../../../api/traceApi";

function CreateTraceProductPage() {
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    
    const [selectedProductGtin, setSelectedProductGtin] = useState("");

    const [quantity, setQuantity] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await listProducts({
                    page: 1,
                    limit: 5,
                });
                
                setProducts(res.data.products);
            } catch (error) {
                console.error(error)
            }
        }
        fetchProducts();
    }, []);

    const selectedProduct = products.find(
        (product) => product.gtin === selectedProductGtin
    );

    const handleSubmit = async () => {
        if (!selectedProductGtin) {
            toast.error("Please select a product");
            return;
        }
        if (!quantity.trim()) {
            toast.error("Quantity is required");
            return;
        }
        if (Number(quantity) <= 0) {
            toast.error("Quantity must be greater than 0")
            return;
        }

        try {
                setIsLoading(true);

                const res = await createTraceProduct({
                    gtin: selectedProductGtin,
                    quantity: Number(quantity)
                });

                toast.success(res.message);

                navigate(`/grower/trace-products/${res.data.traceProduct.id}`);
        } catch (error) {
                const axiosError = error as AxiosError<{
                    message: string
                }>;
                toast.error(axiosError.response?.data.message ?? "Failed to create trace product")
        } finally {
                setIsLoading(false);
        }
    };

    return (
        <RoleLayout role="GROWER">
            <div className="create-trace-product-page">
                <PageHeader
                    title="Create Trace Product"
                    description="Register a new trace product."
                />

                <div className="create-trace-product-card">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>
                                Product
                            </label>

                            <select
                                value={selectedProductGtin}
                                onChange={(e) =>
                                    setSelectedProductGtin(e.target.value)
                                }
                            >
                                <option value="">
                                    Select product
                                </option>

                                {products.map(
                                    (product) => (
                                        <option
                                            key={product.gtin}
                                            value={product.gtin}
                                        >
                                            {product.varietyName}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                Quantity
                            </label>

                            <div className="quantity-input-wrapper">
                                <input
                                    type="number"
                                    placeholder="Enter quantity"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value)
                                    }
                                />

                                <span>
                                    {selectedProduct?.unitOfMeasure}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="create-trace-product-actions">
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {
                                isLoading
                                    ? "Creating..."
                                    : "Create"
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </RoleLayout>
    );
}

export default CreateTraceProductPage;