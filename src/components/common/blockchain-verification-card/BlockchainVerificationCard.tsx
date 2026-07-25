import type { VerificationState } from "../../../types/types";
import "./BlockchainVerificationCard.css";

import {
    FiAlertTriangle,
    FiCheckCircle,
    FiClock,
    FiGlobe,
    FiLink,
    FiShield,
    FiMail
} from "react-icons/fi";

interface BlockchainVerificationCardProps {
    state: VerificationState;

    traceProductId?: string;
    totalEvents?: number;
    validEvents?: number;
    invalidEvents?: number;
    missingRecords?: number;
    invalidEventIds?: string[];
    missingEventIds?: string[];

    verifiedAt?: string;

    onVerify?: () => void;
}

function BlockchainVerificationCard({
    state,

    traceProductId,
    totalEvents,
    validEvents,
    invalidEvents,
    missingRecords,
    invalidEventIds = [],
    missingEventIds = [],

    onVerify,
}: BlockchainVerificationCardProps) {

    const showResult = state === "SUCCESS" || state === "FAILED";

    const handleReportIssues = () => {
        const reportEmail = import.meta.env.VITE_REPORT_EMAIL;

        const subject = `Supply Chain Verification Issue - ${traceProductId}`;

        const body = 
        `Hello,
        
        I found issues during blockchain verification.

        Trace Product ID:
        ${traceProductId}

        Invalid Event IDs:
        ${invalidEventIds.length > 0 ? invalidEventIds.join("\n") : "-"}

        Missing Events IDs:
        ${missingEventIds.length > 0 ? missingEventIds.join("\n") : "-"}

        Please review these records.

        Thank you.`

        window.location.href = `mailto:${reportEmail}` + `?subject=${encodeURIComponent(subject)}` + `&body=${encodeURIComponent(body)}`;
    };

    return (
        <>
            <section className="verification-card">

                {/* LEFT */}

                <div className="verification-column">

                    <div className="verification-label">

                        <div className="verification-icon">
                            <FiLink />
                        </div>

                        <h2>
                            Blockchain Verification
                        </h2>

                    </div>

                    <p>
                        Verify the authenticity and
                        integrity of this product history
                        using blockchain records.
                    </p>
                </div>

                {/* CENTER */}

                <div className="verification-column">

                    <div className="verification-label">
                        <div className="verification-icon">
                            <FiGlobe />
                        </div>
                        <span>Network</span>
                    </div>

                    <h3>
                        Sepolia Testet
                    </h3>

                    {state === "IDLE" && null}

                </div>

                {/* RIGHT */}

                <div className="verification-column">

                    <div className="verification-label">
                        <div className="verification-icon">
                            <FiShield />
                        </div>
                        <span>Action</span>
                    </div>

                    {state === "IDLE" && (
                        <button
                            className="verify-button"
                            onClick={onVerify}
                        >
                            Verify Product
                        </button>
                    )}

                    {state === "VERIFYING" && (
                        <>
                            <div className="verification-status-box">

                                <FiClock />

                                <span>
                                    Verifying...
                                </span>

                            </div>
                        </>
                    )}

                    {state === "SUCCESS" && (
                        <div className="verification-status-box success">
                            <FiCheckCircle />

                            <span>
                                Verified
                            </span>
                        </div>
                    )}

                    {state === "FAILED" && (
                        <>
                            <div className="verification-status-box failed">

                                <FiAlertTriangle />

                                <span>
                                    Verification Issues
                                    Detected
                                </span>

                            </div>

                            <p className="verification-subtext">
                                See details below.
                            </p>
                        </>
                    )}

                </div>

            </section>

            {showResult && (
                <section className="verification-result-card">

                    <div className="result-header">

                        <div>

                            <h3>
                                Verification Result
                            </h3>

                            <p>
                                {state === "SUCCESS"
                                    ? "The product supply chain history has been successfully verified."
                                    : "Issues were detected during verification."}
                            </p>

                        </div>
                    </div>

                    <div className="result-stats">

                        <div className="result-stat">
                            <span>Total Events</span>

                            <strong>
                                {totalEvents}
                            </strong>
                        </div>

                        <div className="result-stat">
                            <span>Valid Events</span>

                            <strong className="success-text">
                                {validEvents}
                            </strong>
                        </div>

                        <div className="result-stat">
                            <span>Invalid Events</span>

                            <strong className="warning-text">
                                {invalidEvents}
                            </strong>
                        </div>

                        <div className="result-stat">
                            <span>Missing Records</span>

                            <strong className="info-text">
                                {missingRecords}
                            </strong>
                        </div>

                    </div>

                    {state === "FAILED" && (
                        <div className="issues-box">

                            <div>

                                <h4>
                                    Issues Found
                                </h4>

                                <p>
                                    We detected invalid or
                                    missing blockchain
                                    records.
                                </p>

                            </div>

                            <button
                                onClick={handleReportIssues}
                            >
                                <FiMail/>
                                Report Issues
                            </button>

                        </div>
                    )}

                </section>
            )}
        </>
    );
}

export default BlockchainVerificationCard;