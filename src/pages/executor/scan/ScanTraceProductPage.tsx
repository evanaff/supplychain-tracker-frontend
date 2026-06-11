import "./ScanTraceProductPage.css";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

import RoleLayout from "../../../layouts/RoleLayout";
import PageHeader from "../../../components/layout/page-header/PageHeader";
import Button from "../../../components/common/button/Button";
import type { Role } from "../../../types/types";

interface Props {
    role: Role
}

function ScanTraceProductPage({
    role
}: Props) {
    const navigate =
        useNavigate();

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            {
                fps: 10,
                qrbox: 250
            },
            false
        );
    
        scanner.render(
            (decodedText) => {
                scanner.clear();
                const splitedDecodedText = decodedText.split("/");
                const traceProductId = splitedDecodedText[splitedDecodedText.length - 1];
                navigate(
                    `/${role.toLowerCase()}/trace-products/${traceProductId}`
                );
            },
            (error) => {
                console.error(error);
            }
        );

        return () => {
            scanner.clear().catch(() => {});
        };
    }, [navigate, role]);

    const [
        traceProductId,
        setTraceProductId,
    ] = useState("");

    const handleSearch =
        () => {
            const targetId =
                traceProductId.trim();

            navigate(
                `/grower/trace-products/${targetId}`
            );
        };

    return (
        <RoleLayout role={role}>
            <div className="scan-trace-product-page">
                <PageHeader
                    title="Scan Trace Product"
                    description="
                        Scan QR code to
                        view product
                        traceability.
                    "
                />

                <div className="scan-trace-product-card">
                    <div
                        id="qr-reader"
                        className="qr-scan-placeholder"
                    />

                    <div className="trace-product-search-section">
                        <label>
                            Or enter Trace
                            Product ID
                        </label>

                        <div className="trace-product-search-row">
                            <input
                                type="text"
                                placeholder="Enter Trace Product ID..."
                                value={
                                    traceProductId
                                }
                                onChange={(e) =>
                                    setTraceProductId(e.target.value)
                                }
                            />

                            <Button
                                onClick={handleSearch}
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </RoleLayout>
    );
}

export default ScanTraceProductPage;