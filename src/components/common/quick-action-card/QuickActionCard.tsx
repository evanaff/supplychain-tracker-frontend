import "./QuickActionCard.css";

import { FiChevronRight } from "react-icons/fi";

interface QuickActionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;

    onClick?: () => void;
}

function QuickActionCard({
    icon,
    title,
    description,
    onClick,
}: QuickActionCardProps) {
    return (
        <button
            className="quick-action-card"
            onClick={onClick}
        >
            <div className="quick-action-left">
                <div className="quick-action-icon">
                    {icon}
                </div>

                <div className="quick-action-content">
                    <h3>
                        {title}
                    </h3>

                    <p>
                        {description}
                    </p>
                </div>
            </div>

            <div className="quick-action-arrow">
                <FiChevronRight />
            </div>
        </button>
    );
}

export default QuickActionCard;