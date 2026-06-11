import "./CreateTraceEventPage.css";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import RoleLayout from "../../../layouts/RoleLayout";
import PageHeader from "../../../components/layout/page-header/PageHeader";
import Button from "../../../components/common/button/Button";
import Loading from "../../../components/common/loading/Loading";
import NotFound from "../../../components/common/not-found/NotFound";
import type { Role, SupplyChainActivity, TraceProduct, Location } from "../../../types/types";
import { listLocations } from "../../../api/locationApi";
import { createHarvestingEvent, createReceivingEvent, createSellingEvent, createShippingEvent, getTraceProductById } from "../../../api/traceApi";
import type { CreateTraceEventDTO } from "../../../types/dataTransferObjects";

interface Props {
    role: Role;
    eventType: SupplyChainActivity;
}

function CreateTraceEventPage({
    role,
    eventType,
}: Props) {
    const navigate = useNavigate();

    const { id } = useParams();

    const [traceProduct, setTraceProduct] = useState<TraceProduct>();
    
    const [destinationLocationSearch, setDestinationLocationSearch] = useState("");
    
    const [destinationLocationGln, setDestinationLocationGln] = useState("");
    
    const [locations, setLocations] = useState<Location[]>([]);

    const [initialLoading, setInitialLoading] = useState(true);
    
    const [submitLoading, setSubmitLoading] = useState(false);
    
    useEffect(() => {
        if (!id) return;

        const fetchTraceProduct = async () => {
            try {
                const res = await getTraceProductById(id);
                
                setTraceProduct(res.data.traceProduct);
            } catch (error) {
                console.error(error);
            } finally {
                setInitialLoading(false);
            }
        }
        fetchTraceProduct();
    }, [id]);

    useEffect(() => {
        if (eventType !== "SHIPPING") return;

        const fetchLocations = async (search?: string) => {
            try {
                const res = await listLocations({
                    page: 1,
                    limit: 5,
                    search
                });

                setLocations(res.data.locations);
            } catch (error) {
                console.error(error);
            }
        };

        const search = destinationLocationSearch.trim();
        if (!search) return;
        
        const timer = setTimeout(() => {
            fetchLocations(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [destinationLocationSearch, eventType]);
    function getTitle() {
        switch (
            eventType
        ) {
            case "HARVESTING":
                return "Create Harvesting Event";

            case "SHIPPING":
                return "Ship Product";

            case "RECEIVING":
                return "Receive Product";

            case "SELLING":
                return "Sell Product";
        }
    }

    function getDescription() {
        switch (
            eventType
        ) {
            case "HARVESTING":
                return "Harvesting event will be generated automatically for this trace product.";

            case "SHIPPING":
                return "Shipping event will be generated automatically for this trace product.";

            case "RECEIVING":
                return "Receiving event will be generated automatically for this trace product.";

            case "SELLING":
                return "Selling event will be generated automatically for this trace product.";
        }
    }

    async function handleSubmit() {
        if (!id) {
            toast.error("Trace product ID is required");
            return;
        }
        
        try {
            setSubmitLoading(true);

            const payload: CreateTraceEventDTO = {
                traceProductId: id,
                destinationLocationGln: destinationLocationGln || undefined
            }

            let res;

            switch (eventType) {
                case "HARVESTING":
                    res = await createHarvestingEvent(payload);
                    break;
            
                case "SHIPPING":
                    res = await createShippingEvent(payload);
                    break;
            
                case "RECEIVING":
                    res = await createReceivingEvent(payload);
                    break;
            
                case "SELLING":
                    res = await createSellingEvent(payload);
                    break;
            }

            toast.success(res.message);
            
            navigate(`/${role.toLowerCase()}/trace-events/${res.data.traceEvent.id}/review`);
        } catch (error) {
            const axiosError = error as AxiosError <{
                message: string
            }>;
            toast.error(axiosError.response?.data.message ?? "Failed to create trace event");
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

    if (!traceProduct) {
        return (
            <RoleLayout role={role}>
                <NotFound />
            </RoleLayout>
        );
    }

    return (
        <RoleLayout role={role}>
            <PageHeader
                title={
                    getTitle()
                }
                description={
                    getDescription()
                }
            />

            <div className="create-event-card">
                <div className="trace-product-card-header">
                    Trace Product
                </div>

                <div className="trace-product-grid">
                    <div className="trace-product-group">
                        <span>
                            Trace Product ID
                        </span>

                        <p>
                            {traceProduct.id}
                        </p>
                    </div>

                    <div className="trace-product-group">
                        <span>
                            Variety Name
                        </span>

                        <p>
                            {traceProduct.product.varietyName}
                        </p>
                    </div>

                    <div className="trace-product-group">
                        <span>
                            Lot Number
                        </span>

                        <p>
                            {traceProduct.lotNumber}
                        </p>
                    </div>

                    <div className="trace-product-group">
                        <span>
                            Quantity
                        </span>

                        <p> {traceProduct.quantity} {traceProduct.product.unitOfMeasure}
                        </p>
                    </div>
                </div>

                {eventType ===
                    "SHIPPING" && (
                    <div className="shipping-location-section">
                        <label>
                            Destination
                            Location
                        </label>

                        <input
                            type="text"
                            placeholder="Search..."
                            value={destinationLocationSearch}
                            onChange={(event) => {
                                setDestinationLocationSearch(event.target.value);

                                setDestinationLocationGln("");
                            }}
                        />

                        {
                            destinationLocationSearch.trim() && locations.length > 0 && !destinationLocationGln && (
                            <div className="location-picker-list">
                                {locations.map(
                                    (location) => (
                                        <button
                                            key={location.gln}
                                            type="button"
                                            className={`location-option ${
                                                destinationLocationGln === location.gln
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                setDestinationLocationGln(location.gln);

                                                setDestinationLocationSearch(location.name);

                                                setLocations([]);
                                            }}
                                        >
                                            {location.name}
                                        </button>
                                    )
                                )}
                            </div>
                            )
                        }
                    </div>
                )}

                <div className="create-event-actions">
                    <Button
                        disabled={(eventType === "SHIPPING" && !destinationLocationGln) || submitLoading}
                        onClick={handleSubmit}
                    >
                        {
                            submitLoading
                                ? "Creating..."
                                : "Create"
                        }
                    </Button>
                </div>
            </div>
        </RoleLayout>
    );
}

export default CreateTraceEventPage;