import "./StatsCard.css";

interface StatsCardProps {
    icon: React.ReactNode;
    value: string;
    label: string;
}

function StatsCard({
    icon,
    value,
    label,
}: StatsCardProps) {
    return (
        <div className="stats-card">
            <div className="stats-card-icon">
                {icon}
            </div>

            <h2 className="stats-card-value">
                {value}
            </h2>

            <p className="stats-card-label">
                {label}
            </p>
        </div>
    );
}

export default StatsCard;