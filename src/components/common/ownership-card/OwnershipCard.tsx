import "./OwnershipCard.css";

import type { Actor } from "../../../types/types";

interface OwnershipCardProps {
    owner: Actor
}

export default function OwnershipCard({
    owner
}: OwnershipCardProps) {
    return (
        <div className="ownership-card">
            <h3 className="ownership-card-title">
                Current Ownership
            </h3>

            <div className="ownership-card-content">
                <div className="ownership-section">
                    <span className="ownership-label">
                        Current Owner
                    </span>

                    <span className="ownership-value">
                        {owner.name}
                    </span>

                    <span className="ownership-role">
                        {owner.role}
                    </span>
                </div>

                <div className="ownership-divider" />

                <div className="ownership-section">
                    <span className="ownership-label">
                        Location
                    </span>

                    <span className="ownership-value">
                        {owner.location.name}
                    </span>

                    <span className="ownership-role">
                        {owner.location.city}, {owner.location.province}
                    </span>
                </div>

                <div className="ownership-divider" />

                <div className="ownership-section">
                    <span className="ownership-label">
                        GLN
                    </span>

                    <span className="ownership-value">
                        {owner.location.gln}
                    </span>
                </div>

                <div className="ownership-divider" />

                <div className="ownership-section">
                    <span className="ownership-label">
                        Current Location
                    </span>

                    <span className="ownership-value">
                        {owner.name}
                    </span>
                </div>
            </div>
        </div>
    );
}