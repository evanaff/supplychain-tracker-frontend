import "./TraceProductHistoryPage.css";

import type { TraceEvent, TraceProduct, VerificationState } from "../../types/types";
import EventTimeline from "../../components/common/event-timeline/EventTimeline";
import BlockchainVerificationCard from "../../components/common/blockchain-verification-card/BlockchainVerificationCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTraceProductHistory, postVerifyTraceProduct } from "../../api/traceApi";
import Loading from "../../components/common/loading/Loading";
import NotFound from "../../components/common/not-found/NotFound";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

function TraceProductHistoryPage() {
    const { id } = useParams();

    const [initialLoading, setInitialLoading] = useState(true);

    const [verificationState, setVerificationState] = useState<VerificationState>("IDLE"); 

    const [traceProduct, setTraceProduct] = useState<TraceProduct>();

    const [traceEvents, setTraceEvents] = useState<TraceEvent[]>([]);

    const [totalEvents, setTotalEvents] = useState(0);

    const [validEvents, setValidEvents] = useState([]);

    const [invalidEvents, setInvalidEvents] = useState([]);

    const [missingEvents, setMissingEvents] = useState([]);

    useEffect(() => {
        if (!id) return;

        const fetchTraceProductHistory = async () => {
            try {
                const res = await getTraceProductHistory(id);

                setTraceProduct(res.data.traceProduct);
                setTraceEvents(res.data.traceEvents);
                setTotalEvents(res.data.traceEvents.length);
            } catch (error) {
                console.error(error);
            } finally {
                setInitialLoading(false);
            }
        }
        fetchTraceProductHistory();
    }, [id]);

    async function handleVerifyButton() {
        try {
            if (!id) return

            setVerificationState("VERIFYING");

            const res = await postVerifyTraceProduct(id);

            setTotalEvents(res.data.totalEvents);
            setValidEvents(res.data.validEvents);
            setInvalidEvents(res.data.invalidEvents);
            setMissingEvents(res.data.missingEvents);

            if (res.data.invalidEvents.length === 0 && res.data.missingEvents.length === 0) {
                setVerificationState("SUCCESS");
            } else {
                setVerificationState("FAILED");
            }
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(axiosError.response?.data.message ?? "Failed to verify trace product");
        }
    }

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

            {/* HERO */}

            <section className="history-hero">

                <div className="history-summary">
                    <h1>
                        Trace Product <span>History</span>
                    </h1>

                    <p>
                        Discover the journey of this
                        product from farm to your hands.
                        All records are verified and
                        immutably stored on the blockchain.
                    </p>
                </div>

                <div className="product-card">

                    <img
                        src={traceProduct.product.imageUrl}
                        alt="product"
                    />

                    <div className="product-details">

                        <div className="product-header">
                            <h3>
                                Trace Product Information
                            </h3>
                        </div>

                        <div className="product-info-grid">
                            <span>
                                ID
                            </span>

                            <span>
                                {traceProduct.id}
                            </span>

                            <span>
                                Variety
                            </span>

                            <span>
                                {traceProduct.product.varietyName}
                            </span>

                            <span>
                                Lot Number
                            </span>

                            <span>
                                {traceProduct.lotNumber}
                            </span>

                            <span>
                                Quantity
                            </span>

                            <span>
                                {traceProduct.quantity} {traceProduct.product.unitOfMeasure}
                            </span>

                        </div>

                    </div>

                </div>

            </section>

            {/* TIMELINE */}

            <section className="timeline-section">

                <h2>
                    Journey Timeline
                </h2>

                <div className="timeline">

                    <EventTimeline
                        events={traceEvents}
                        showActor={false}
                        showRecordStatus={false}
                        showCurrentActor={false}
                        validEventIds={validEvents}
                        invalidEventIds={invalidEvents}
                        missingEventIds={missingEvents}
                    />

                </div>

            </section>

            <BlockchainVerificationCard
                state={verificationState}
                traceProductId={traceProduct.id}
                totalEvents={totalEvents}
                validEvents={validEvents.length}
                invalidEvents={invalidEvents.length}
                missingRecords={missingEvents.length}
                invalidEventIds={invalidEvents}
                missingEventIds={missingEvents}
                onVerify={handleVerifyButton}
            />

        </div>
    );
}

export default TraceProductHistoryPage;