import "./EventTimeline.css";

import Badge from "../badge/Badge";
import { FiUser, FiTruck, FiMapPin, FiClock, FiShoppingCart } from "react-icons/fi";
import { PiPlant } from "react-icons/pi";
import { LuPackage } from "react-icons/lu";

import type { SupplyChainActivity, TraceEvent } from "../../../types/types";
import { timestampToDate } from "../../../utils";

interface EventTimelineProps {
    events: TraceEvent[];
    showActor: boolean;
    showRecordStatus: boolean;
    showCurrentActor: boolean;

    validEventIds?: string[];
    invalidEventIds?: string[];
    missingEventIds?: string[];

    onClickEvent?: (
        eventId: string
    ) => void;
}

function EventTimeline({
    events,
    showActor,
    showRecordStatus,
    showCurrentActor,

    validEventIds,
    invalidEventIds,
    missingEventIds,

    onClickEvent,
}: EventTimelineProps) {
    const walletAddress = localStorage.getItem("walletAddress");

    function getActivityIcon(activity: SupplyChainActivity) {
        switch (activity) {
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
                    <LuPackage />
                );

            case "SELLING":
                return (
                    <FiShoppingCart />
                );

            default:
                return null;
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

    function getBadgeVariant(activity: SupplyChainActivity) {
        switch (activity) {
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

    function getVerificationStatus(
        eventId: string
    ) {
        if (invalidEventIds?.includes(eventId)) {
            return "INVALID";
        }

        if (missingEventIds?.includes(eventId)) {
            return "MISSING";
        }

        if (validEventIds?.includes(eventId)) {
            return "VALID";
        }

        return null;
    }

    function getVerificationClass(
        status: string | null
    ) {
        switch (status) {
            case "INVALID":
                return "timeline-invalid";

            case "MISSING":
                return "timeline-missing";

            default:
                return "";
        }
    }

    return (
        <div className="timeline-list">
            {events.map(
                (
                    event,
                    index
                ) => {
                    const variant = getTimelineClass(event.supplyChainActivity);
                    const isLast =index === events.length - 1;
                    const verificationStatus = getVerificationStatus(event.id);

                    return (
                        <button
                            key={event.id}
                            type="button"
                            className="timeline-row"
                            onClick={() =>
                                onClickEvent?.(event.id)
                            }
                        >
                            <div className="timeline-left">
                                <div
                                    className={`timeline-icon ${variant.icon}`}
                                >
                                    {getActivityIcon(event.supplyChainActivity)}
                                </div>

                                {!isLast && (
                                    <div
                                        className={`timeline-line ${variant.line}`}
                                    />
                                )}
                            </div>

                            <div
                                className={`
                                    timeline-content
                                    ${getVerificationClass(verificationStatus)}
                                `}
                            >
                                <div className="timeline-header">
                                    <div className="timeline-title-group">
                                        <Badge
                                            variant = {getBadgeVariant(event.supplyChainActivity)}
                                        >
                                            {event.supplyChainActivity}
                                        </Badge>

                                        {showCurrentActor && event.actor.blockchainAddress === walletAddress && (
                                            <span className="timeline-current-actor">
                                                Current Actor
                                            </span>
                                        )}

                                    </div>
                                    {verificationStatus && (
                                        <Badge
                                            variant={
                                                verificationStatus === "VALID"
                                                    ? "success"
                                                    : verificationStatus === "INVALID"
                                                    ? "danger"
                                                    : "warning"
                                            }
                                        >
                                            {verificationStatus}
                                        </Badge>
                                    )}
                                    
                                    {showRecordStatus && (
                                        <Badge
                                            variant={
                                                event.isRecorded
                                                    ? "success"
                                                    : "warning"
                                            }
                                        >
                                            {event.isRecorded
                                                    ? "RECORDED"
                                                    : "NOT RECORDED"
                                            }
                                        </Badge>
                                    )}
                                </div>

                                {event.actor && showActor && (
                                    <div className="timeline-meta">
                                        <FiUser />

                                        <span>
                                            {event.actor.name}
                                        </span>
                                    </div>
                                )}

                                {event.actor.location && (
                                    <div className="timeline-meta">
                                        <FiMapPin />

                                        <span>
                                            {`${event.actor.location.name}, ${event.actor.location.city}, ${event.actor.location.province}`}
                                        </span>
                                    </div>
                                )}

                                {event.timestamp && (
                                    <div className="timeline-meta">
                                        <FiClock />

                                        <span>
                                            {timestampToDate(event.timestamp)}
                                        </span>
                                    </div>
                                )}

                                <div className="timeline-meta">
                                    <span>
                                        Tx Hash: {
                                            event.txHash
                                            ? `${event.txHash.slice(0, 5)}...${event.txHash.slice(-5)}`
                                            : "-"
                                        }
                                    </span>
                                </div>

                                {verificationStatus === "INVALID" && (
                                    <div className="timeline-verification-message error">
                                        Event data does not match blockchain record.
                                    </div>
                                )}

                                {verificationStatus === "MISSING" && (
                                    <div className="timeline-verification-message warning">
                                        Blockchain record not found.
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                }
            )}
        </div>
    );
}

export default EventTimeline;