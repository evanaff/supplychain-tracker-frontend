import "./TraceEventDetailPage.css";

import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiTruck, FiShoppingCart } from "react-icons/fi";
import { PiPlant } from "react-icons/pi";
import { LuPackageCheck } from "react-icons/lu";
import { useEffect, useState } from "react";

import RoleLayout from "../../../layouts/RoleLayout";
import Badge from "../../../components/common/badge/Badge";
import Button from "../../../components/common/button/Button";
import Loading from "../../../components/common/loading/Loading";
import NotFound from "../../../components/common/not-found/NotFound";
import type { Role, SupplyChainActivity, TraceEvent, ValidationStatus } from "../../../types/types";
import { getTraceEventById } from "../../../api/traceApi";

interface Props {
    role: Role;
}

function TraceEventDetailPage({
    role,
}: Props) {
    const navigate =
        useNavigate();

    const { id } =
        useParams();

    const [traceEvent, setTraceEvent] = useState<TraceEvent>();

    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchTraceEvent = async () => {
            if (!id) return;
            
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
    
    function getActivityIcon(activity: SupplyChainActivity) {
        switch (
            activity
        ) {
            case "HARVESTING":
                return (
                    <PiPlant />
                );

            case "SHIPPING":
                return (
                    <FiTruck />
                );

            case "RECEIVING":
                return (
                    <LuPackageCheck />
                );

            case "SELLING":
                return (
                    <FiShoppingCart />
                );

            default:
                return null;
        }
    }

    function getActivityBadgeVariant(activity: SupplyChainActivity) {
        switch (
            activity
        ) {
            case "HARVESTING":
                return "success";

            case "SHIPPING":
                return "info";

            case "RECEIVING":
                return "warning";

            case "SELLING":
                return "purple";

            default:
                return "gray";
        }
    }

    function getValidationBadgeVariant(status: ValidationStatus) {
        switch (status) {
            case "VALID":
                return (
                    <Badge variant="success">
                        {status}
                    </Badge>
                );

            case "INVALID":
                return (
                    <Badge variant="danger">
                        {status}
                    </Badge>
                );

            case "PENDING":
                return (
                    <Badge variant="warning">
                        {status}
                    </Badge>
                );

            default:
                return (
                    <Badge>
                        Unknown
                    </Badge>
                );
        }
    }

    function getTimelineClass(activity: SupplyChainActivity) {
        switch (activity) {
            case "HARVESTING":
                return {
                    icon: "timeline-harvesting",
                    line: "timeline-line-harvesting",
                };

            case "SHIPPING":
                return {
                    icon: "timeline-shipping",
                    line: "timeline-line-shipping",
                };

            case "RECEIVING":
                return {
                    icon: "timeline-receiving",
                    line: "timeline-line-receiving",
                };

            case "SELLING":
                return {
                    icon: "timeline-selling",
                    line: "timeline-line-selling",
                };

            default:
                return {
                    icon:"", 
                    line: "",
                };
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

    const variant = getTimelineClass(traceEvent.supplyChainActivity);

    function handleSign() {
        navigate(`/${role.toLowerCase()}/trace-events/${id}/review`);
    }

    return (
        <RoleLayout role={role}>
            <button
                className="back-button"
                onClick={() =>
                    navigate(-1)
                }
            >
                <FiArrowLeft />

                Back
            </button>

            <section className="trace-event-detail-grid">
                <div className="event-card trace-event-card">
                    <div className="event-card-title">
                        <div className="event-card-heading">
                            <div className={`timeline-icon ${variant.icon}`}>
                                {getActivityIcon(traceEvent.supplyChainActivity)}
                            </div>
                            <h2>
                                Trace Event Information
                            </h2>

                            {getValidationBadgeVariant(traceEvent.validationStatus)}
                        </div>

                        {traceEvent.validationStatus ===
                            "PENDING" && (
                            <Button
                                size="sm"
                                onClick={handleSign}
                            >
                                Sign Event
                            </Button>
                        )}
                    </div>

                    <div className="event-header">
                        <div className="event-title">

                            <Badge variant={getActivityBadgeVariant(traceEvent.supplyChainActivity)}>
                                {traceEvent.supplyChainActivity}
                            </Badge>

                        </div>
                    </div>

                    <div className="event-info-grid">
                        <div className="event-info-group">
                            <span>
                                Event ID
                            </span>

                            <p>
                                {traceEvent.id}
                            </p>
                        </div>

                        <div className="event-info-group">
                            <span>
                                Timestamp
                            </span>

                            <p>
                                {traceEvent.timestamp}
                            </p>
                        </div>

                        <div className="event-info-group">
                            <span>
                                Activity
                            </span>

                            <p>
                                {traceEvent.supplyChainActivity}
                            </p>
                        </div>

                        <div className="event-info-group">
                            <span>
                                Transaction Hash
                            </span>

                            <p className="tx-hash">
                                {traceEvent.txHash 
                                    ? traceEvent.txHash 
                                    : "-"
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <div className="event-card">
                    <h2>
                        Actor Information
                    </h2>

                    <div className="event-info-group">
                        <span>
                            Actor Name
                        </span>

                        <p>
                            {traceEvent.actor.name}
                        </p>
                    </div>

                    <div className="event-info-group">
                        <span>
                            Role
                        </span>

                        <p>
                            {traceEvent.actor.role}
                        </p>
                    </div>

                    <div className="event-info-group">
                        <span>
                            Wallet Address
                        </span>

                        <p>
                            {traceEvent.actor.blockchainAddress}
                        </p>
                    </div>
                </div>

                <div className="event-card">
                    <h2>
                        Location Information
                    </h2>

                    <div className="event-info-group">
                        <span>
                            Source GLN
                        </span>

                        <p>
                            {traceEvent.actor.location.gln}
                        </p>
                    </div>

                    <div className="event-info-group">
                        <span>
                            Location Name
                        </span>

                        <p>
                            {traceEvent.actor.location.name}
                        </p>
                    </div>

                    <div className="event-info-group">
                        <span>
                            Province
                        </span>

                        <p>
                            {traceEvent.actor.location.province}
                        </p>
                    </div>

                    <div className="event-info-group">
                        <span>
                            City
                        </span>

                        <p>
                            {traceEvent.actor.location.city}
                        </p>
                    </div>
                </div>
            </section>
        </RoleLayout>
    );
}

export default TraceEventDetailPage;