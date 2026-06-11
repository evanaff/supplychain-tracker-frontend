import "./Badge.css";

interface BadgeProps {
    children: React.ReactNode;
    variant?:
        | "success"
        | "info"
        | "purple"
        | "warning"
        | "danger"
        | "gray";
    size?:
        | "sm"
        | "md";
}

function Badge({
    children,
    variant = "gray",
    size = "md",
}: BadgeProps) {
    return (
        <span
            className={`
                badge
                badge-${variant}
                badge-${size}
            `}
        >
            {children}
        </span>
    );
}

export default Badge;