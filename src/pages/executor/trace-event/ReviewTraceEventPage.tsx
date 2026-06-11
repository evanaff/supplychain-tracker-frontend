import "./ReviewTraceEventPage.css";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { ethers } from "ethers";

import RoleLayout from "../../../layouts/RoleLayout";
import PageHeader from "../../../components/layout/page-header/PageHeader";
import Button from "../../../components/common/button/Button";
import Loading from "../../../components/common/loading/Loading";
import NotFound from "../../../components/common/not-found/NotFound";
import type { Role, TraceEvent } from "../../../types/types";
import { generateMessageHash, getTraceEventById, submitTraceEvent } from "../../../api/traceApi";

interface Props {
    role: Role
}

function ReviewTraceEventPage({
    role,
}: Props) {
    const navigate =
        useNavigate();

    const { id } =
        useParams();

    const [traceEvent, setTraceEvent] = useState<TraceEvent>();

    const [initialLoading, setInitialLoading] = useState(true);
    
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        if (!id) return
        
        const fetchTraceEvent = async () => {
            try {
                const res = await getTraceEventById(id);
    
                setTraceEvent(res.data.traceEvent);
                
            } catch (error) {
                console.error(error);
            } finally {
                setInitialLoading(false);
            }
        }
        fetchTraceEvent();
    }, [id]);

    async function handleSignSubmit() {
        if (!id) {
            toast.error("Trace event ID is required");
            return;
        }

        try {
            setSubmitLoading(true);

            const messageHashRes = await generateMessageHash(id);
            const messageHash = messageHashRes.data.messageHash;
            
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const signature = await signer.signMessage(ethers.getBytes(messageHash));
            
            const submitRes = await submitTraceEvent(id, { signature });

            toast.success(submitRes.message);

            navigate(`/${role.toLowerCase()}/trace-products/${traceEvent?.traceProduct.id}`);
        } catch (error) {
            const axiosError = error as AxiosError<{
                message: string
            }>;
            toast.error(axiosError.response?.data.message ?? "Failed to submit trace event");
        } finally {
            setSubmitLoading(false);
        }
    }

    if (initialLoading) {
        return (
            <RoleLayout role={role}>
                <Loading />
            </RoleLayout>
        );
    }

    if (!traceEvent) {
        return (
            <RoleLayout role={role}>
                <NotFound />
            </RoleLayout>
        );
    }

    return (
        <RoleLayout role={role}>
            <PageHeader
                title="Review & Sign Trace Event"
                description="Please review the event details before signing."
            />

            <div className="review-trace-event-card">
                <div className="review-trace-event-content">
                    <div className="review-section">
                        <h3>
                            Trace Product Summary
                        </h3>

                        <div className="review-grid">
                            <div>
                                <span>ID</span>
                                <p>{traceEvent.traceProduct.id}</p>
                            </div>

                            <div>
                                <span>GTIN</span>
                                <p>{traceEvent.traceProduct.product.gtin}</p>
                            </div>

                            <div>
                                <span>Lot Number</span>
                                <p>{traceEvent.traceProduct.lotNumber}</p>
                            </div>

                            <div>
                                <span>Quantity</span>
                                <p>{traceEvent.traceProduct.quantity}</p>
                            </div>
                        </div>
                    </div>

                    <div className="review-section">
                        <h3>
                            Trace Event - To be signed
                        </h3>

                        <div className="review-grid">
                            <div>
                                <span>Activity</span>
                                <p>{traceEvent.supplyChainActivity}</p>
                            </div>

                            <div>
                                <span>Actor</span>
                                <p>{traceEvent.actor.name}</p>
                            </div>

                            <div>
                                <span>From</span>
                                <p>{traceEvent.actor.location.name}</p>
                            </div>

                            {traceEvent.destinationLocation && (
                                <div>
                                    <span>To</span>
                                    <p>{traceEvent.destinationLocation.name}</p>
                                </div>
                            )}

                            <div>
                                <span>Timestamp</span>
                                <p>{traceEvent.timestamp}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="review-actions">
                    <Button
                        onClick={handleSignSubmit}
                        disabled={submitLoading}
                    >
                        Sign & Submit
                    </Button>
                </div>
            </div>
        </RoleLayout>
    );
}

export default ReviewTraceEventPage;