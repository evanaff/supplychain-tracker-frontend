import "./Button.css";

interface ButtonProps {
    children: React.ReactNode;

    variant?:
        | "primary"
        | "secondary"
        | "outline";

    size?:
        | "sm"
        | "md"
        | "lg";

    type?:
        | "button"
        | "submit"
        | "reset";

    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    fullWidth?: boolean;
    disabled?: boolean;

    onClick?: () => void;
}

function Button({
    children,

    variant = "primary",
    size = "md",
    type = "button",

    iconLeft,
    iconRight,
    fullWidth = false,
    disabled = false,
    onClick,
}: ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`
                button
                button-${variant}
                button-${size}
                ${
                    fullWidth
                        ? "button-full"
                        : ""
                }
            `}
        >
            {iconLeft && (
                <span className="button-icon">
                    {iconLeft}
                </span>
            )}

            <span>
                {children}
            </span>

            {iconRight && (
                <span className="button-icon">
                    {iconRight}
                </span>
            )}
        </button>
    );
}

export default Button;