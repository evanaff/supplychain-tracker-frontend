import "./BlockchainVerificationCard.css";

import {
    FiCheckCircle,
    FiExternalLink
} from "react-icons/fi";

interface BlockchainVerificationCardProps {
    verifiedEvents: number;

    totalEvents: number;

    lastVerification: string;

    blockchainNetwork: string;

    explorerUrl?: string;
}

function BlockchainVerificationCard({
    verifiedEvents,
    totalEvents,
    lastVerification,
    blockchainNetwork,
    explorerUrl,
}: BlockchainVerificationCardProps) {
    return (
        <aside className="verification-card">
            <h3 className="verification-card-title">
                Blockchain Verification
            </h3>

            <button
                className="verification-action-button"
                type="button"
            >
                <FiCheckCircle />

                <div>
                    <span>
                        Verify Trace Events
                    </span>
                </div>
            </button>

            <div className="verification-details">
                <div className="verification-detail-row">
                    <span>
                        Verified Events
                    </span>

                    <strong>
                        {verifiedEvents}
                        {" / "}
                        {totalEvents}
                    </strong>
                </div>

                <div className="verification-detail-row">
                    <span>
                        Last Verification
                    </span>

                    <strong>
                        {lastVerification}
                    </strong>
                </div>

                <div className="verification-detail-row">
                    <span>
                        Blockchain Network
                    </span>

                    <strong>
                        {blockchainNetwork}
                    </strong>
                </div>
            </div>

            {explorerUrl && (
                <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="verification-explorer-button"
                >
                    View on Blockchain Explorer

                    <FiExternalLink />
                </a>
            )}
        </aside>
    );
}

export default BlockchainVerificationCard;