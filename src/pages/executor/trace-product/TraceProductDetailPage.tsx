import "./TraceProductDetailPage.css";

import { useNavigate, useParams }from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
import { QRCode } from "react-qr-code";
import { PiPlant } from "react-icons/pi";

import RoleLayout from "../../../layouts/RoleLayout";
import Button from "../../../components/common/button/Button";
import EventTimeline from "../../../components/common/event-timeline/EventTimeline";
import Loading from "../../../components/common/loading/Loading";
import NotFound from "../../../components/common/not-found/NotFound";
import { type TraceProduct, type Role, type TraceEvent } from "../../../types/types";
import { getTraceProductHistory } from "../../../api/traceApi";
import { timestampToDate } from "../../../utils";

interface Props {
    role: Role;
}

function TraceProductDetailPage({
    role,
}: Props) {
    const navigate = useNavigate();
    
    const { id } = useParams();

    const [initialLoading, setInitialLoading] = useState(true);

    const [traceProduct, setTraceProduct] = useState<TraceProduct>();

    const [traceEvents, setTraceEvents] = useState<TraceEvent[]>([]);

    const qrRef = useRef<HTMLDivElement>(null);

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
        fetchTraceProductHistory();
    }, [id]);

    function renderActionButtons() {
        if (!traceProduct) return
        
        if (role === "GROWER") {
            return (
                <Button
                    onClick={() => 
                        traceEvents.length > 0
                            ? navigate(`/${role.toLowerCase()}/trace-products/${traceProduct.id}/shipping`)
                            : navigate(`/${role.toLowerCase()}/trace-products/${traceProduct.id}/harvesting`)
                    }
                >
                    {traceEvents.length > 0
                        ? "Create Shipping Event"
                        : "Create Harvesting Event"}
                </Button>
            );
        }

        if (role ==="DISTRIBUTOR") {
            return (
                <>
                    <Button 
                        onClick={() => {
                            navigate(`/${role.toLowerCase()}/trace-products/${traceProduct.id}/receiving`)
                        }}
                    >
                        Create Receiving Event
                    </Button>

                    <Button
                        onClick={() => {
                            navigate(`/${role.toLowerCase()}/trace-products/${traceProduct.id}/shipping`)
                        }}
                    >
                        Create Shipping Event
                    </Button>
                </>
            );
        }

        return (
            <>
                <Button 
                    onClick={() => {
                        navigate(`/${role.toLowerCase()}/trace-products/${traceProduct.id}/receiving`)
                    }}
                >
                    Create Receiving Event
                </Button>

                <Button 
                    onClick={() => {
                        navigate(`/${role.toLowerCase()}/trace-products/${traceProduct.id}/selling`)
                    }}
                >
                    Create Selling Event
                </Button>
            </>
        );
    }

    function handlerDownloadQR () {
        if (!traceProduct) return;

        const svg = qrRef.current?.querySelector("svg");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        
        canvas.width = 360;
        canvas.height = 360;

        img.onload = () => {
            if (!ctx) return;

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 30, 30, 300, 300);
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.download = `trace-product=${traceProduct.id}.png`;
            downloadLink.href = pngFile;
            
            downloadLink.click();
        }

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }

    function handleClickEvent(id: string) {
        navigate(`/${role.toLowerCase()}/trace-events/${id}`)
    }

    if (initialLoading) {
        return (
            <RoleLayout role={role}>
                <Loading />
            </RoleLayout>
        );
    }

    if (!traceProduct) {
        return (
            <RoleLayout role={role}>
                <NotFound />
            </RoleLayout>
        );
    }

    const qrValue = `${window.location.origin}/trace-products/${traceProduct.id}`;

    return (
        <RoleLayout role={role}>
            <button
                className="back-button"
                onClick={() =>
                    navigate(`/${role.toLowerCase()}/trace-products`)
                }
            >
                <FiArrowLeft />

                Back to list
            </button>

            <section className="trace-product-detail-grid">
                <div className="trace-product-left-column">
                    <div className="product-info-card">
                        <div className="qr-placeholder" ref={qrRef}>
                            <QRCode
                                value={qrValue}
                                size={140}
                            />
                        </div>

                        <Button
                            fullWidth
                            iconLeft={
                                <FiDownload />
                            }
                            onClick={handlerDownloadQR}
                        >
                            Download QR
                        </Button>

                        <div className="product-summary">
                            <div className="product-info-group">
                                <span>
                                    ID
                                </span>

                                <p>
                                    {traceProduct.id}
                                </p>
                            </div>

                            <div className="product-info-group">
                                <span>
                                    Product Name
                                </span>

                                <p>
                                    {traceProduct.product.varietyName}
                                </p>
                            </div>

                            <div className="product-info-group">
                                <span>
                                    Lot Number
                                </span>

                                <p>
                                    {traceProduct.lotNumber}
                                </p>
                            </div>

                            <div className="product-info-group">
                                <span>
                                    Quantity
                                </span>

                                <p>
                                    {traceProduct.quantity} {traceProduct.product.unitOfMeasure}
                                </p>
                            </div>

                            <div className="product-info-group">
                                <span>
                                    Current Owner
                                </span>

                                <p>
                                    {
                                        traceProduct.owner.name
                                    }
                                </p>
                            </div>

                            <div className="product-info-group">
                                <span>
                                    Current Location
                                </span>

                                <p>
                                    {traceProduct.owner.location.name}
                                </p>
                            </div>

                            <div className="product-info-group">
                                <span>
                                    Created At
                                </span>

                                <p>
                                    {timestampToDate(traceProduct.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="timeline-card">
                    <h2>
                        Event Timeline
                    </h2>

                    {traceEvents.length > 0 ? (
                        <EventTimeline
                            events={traceEvents}
                            onClickEvent={handleClickEvent}
                        />
                    ) : (
                        <div className="timeline-empty-state">
                            <div className="timeline-empty-icon">
                                <PiPlant />
                            </div>

                            <h3>
                                No Events Yet
                            </h3>

                            <p>
                                This trace product has not started its supply chain journey yet.
                                Create a harvesting event to begin product traceability.
                            </p>
                        </div>
                    )}

                    <div className="trace-product-actions">
                        {renderActionButtons()}
                    </div>
                </div>
            </section>
        </RoleLayout>
    );
}

export default TraceProductDetailPage;