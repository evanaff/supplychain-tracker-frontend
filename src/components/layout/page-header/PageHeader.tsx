import "./PageHeader.css";

interface PageHeaderProps {
    title: string;
    description?: string;

    action?: React.ReactNode;
}

function PageHeader({
    title,
    description,
    action,
}: PageHeaderProps) {
    return (
        <div className="page-header">
            <div className="page-header-left">
                <h1 className="page-title">
                    {title}
                </h1>

                {description && (
                    <p className="page-description">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <div className="page-header-right">
                    {action}
                </div>
            )}
        </div>
    );
}

export default PageHeader;