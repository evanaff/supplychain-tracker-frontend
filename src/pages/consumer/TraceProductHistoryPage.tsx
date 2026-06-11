import "./TraceProductHistoryPage.css";

import TraceProductSummaryCard from "../../components/common/trace-product-summary-card/TraceProductSummaryCard";

import ProductInfoCard
    from "../../components/common/product-info-card/TraceProductInfoCard";

import OwnershipCard
    from "../../components/common/ownership-card/OwnershipCard";

import EventTimeline from "../../components/common/event-timeline/EventTimeline";
import BlockchainVerificationCard from "../../components/common/blockchain-verification-card/BlockchainVerificationCard";
import type { TraceEvent, TraceProduct } from "../../types/types";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTraceProductHistory } from "../../api/traceApi";
import Loading from "../../components/common/loading/Loading";
import NotFound from "../../components/common/not-found/NotFound";
import { ethers } from "ethers";

function TraceProductHistoryPage() {
    const { id } = useParams();

    const [initialLoading, setInitialLoading] = useState(true);

    const [traceProduct, setTraceProduct] = useState<TraceProduct>();

    const [traceEvents, setTraceEvents] = useState<TraceEvent[]>([]);

    const [blockchainNetwork, setBlockchainNetwork] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchTraceProductHistory = async () => {
            try {
                const res = await getTraceProductHistory(id);

                setTraceProduct(res.data.traceProduct);
                setTraceEvents(res.data.traceEvents);
            } catch (error) {
                console.error(error);
            } finally {
                setInitialLoading(false);
            }
        }

        const getNetworkName = async () => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();
            let networkName = network.name;
            const chainId = Number(network.chainId);
            console.log(networkName);
            
            if (networkName === "unknown") {
                switch (chainId) {
                    case 31337:
                        networkName = "Hardhat Local";
                        break;
        
                    case 11155111:
                        networkName = "Sepolia";
                        break;
        
                    case 1:
                        networkName = "Ethereum Mainnet";
                        break;
        
                    default:
                        networkName = `Unknown (${chainId})`;
                        break;
                }
            }
            
            setBlockchainNetwork(networkName);
        }

        fetchTraceProductHistory();
        getNetworkName();
    }, [id]);

    if (initialLoading) {
        return (
            <Loading />
        );
    }

    if (!traceProduct) {
        return (
            <NotFound />
        );
    }

    return (
        <div className="product-history-page">
            <div className="consumer-page-header">
                <h1>
                    Trace Product History
                </h1>
            </div>

            <div className="product-history-top-grid">
                <TraceProductSummaryCard
                    traceProduct={traceProduct}
                />

                <ProductInfoCard
                    imageUrl={traceProduct.product.imageUrl}
                    productName={traceProduct.product.varietyName}
                    gtin={traceProduct.product.gtin}
                    quantity={traceProduct.quantity}
                    unitOfMeasure={traceProduct.product.unitOfMeasure}
                />
            </div>

            <OwnershipCard
                owner={traceProduct.owner}
            />

            <div className="product-history-content">
                <section
                    className="timeline-section"
                >
                    <h2>
                        Timeline
                    </h2>

                    <EventTimeline
                        events={traceEvents}
                    />
                </section>

                <BlockchainVerificationCard
                    verifiedEvents={2}
                    totalEvents={3}
                    lastVerification="04 June 2026"
                    blockchainNetwork={blockchainNetwork}
                    explorerUrl="#"
                />
            </div>
        </div>
    );
}

export default TraceProductHistoryPage;