import "./EventTimeline.css";

import Badge from "../badge/Badge";
import { FiCheck, FiTruck, FiMapPin, FiClock } from "react-icons/fi";
import { PiPlant } from "react-icons/pi";
import { LuPackageCheck } from "react-icons/lu";

import type { SupplyChainActivity, TraceEvent } from "../../../types/types";
import { timestampToDate } from "../../../utils";

interface EventTimelineProps {
    events: TraceEvent[];

    onClickEvent?: (
        eventId: string
    ) => void;
}

function EventTimeline({
    events,
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
                    <LuPackageCheck />
                );

            case "SELLING":
                return (
                    <FiCheck />
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

    return (
        <div className="timeline-list">
            {events.map(
                (
                    event,
                    index
                ) => {
                    const variant = getTimelineClass(event.supplyChainActivity);
                    const isLast =index === events.length - 1;

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

                            <div className="timeline-content">
                                <div className="timeline-header">
                                    <div className="timeline-title-group">
                                        <Badge
                                            variant = {getBadgeVariant(event.supplyChainActivity)}
                                        >
                                            {event.supplyChainActivity}
                                        </Badge>

                                        <Badge
                                            variant={
                                                event.validationStatus ===
                                                "VALID"
                                                    ? "success"
                                                    : "warning"
                                            }
                                        >
                                            {event.validationStatus}
                                        </Badge>
                                    </div>

                                    {event.actor.blockchainAddress === walletAddress && (
                                        <span className="timeline-current-actor">
                                            Current
                                            Actor
                                        </span>
                                    )}
                                </div>

                                {event.timestamp && (
                                    <div className="timeline-meta">
                                        <FiClock />

                                        <span>
                                            {timestampToDate(event.timestamp)}
                                        </span>
                                    </div>
                                )}

                                {event.actor.location && (
                                    <div className="timeline-meta">
                                        <FiMapPin />

                                        <span>
                                            {event.actor.location.name}
                                        </span>
                                    </div>
                                )}

                                {event.actor && (
                                    <div className="timeline-meta">
                                        <FiCheck />

                                        <span>
                                            {event.actor.name}
                                        </span>
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