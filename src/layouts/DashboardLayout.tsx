import "./DashboardLayout.css";

import Sidebar from "../components/layout/sidebar/Sidebar";
import Topbar from "../components/layout/topbar/Topbar";

interface DashboardLayoutProps {
    children: React.ReactNode;

    role: "ADMIN"| "GROWER" | "DISTRIBUTOR" | "RETAILER";
}

function DashboardLayout({
    children,
    role,
}: DashboardLayoutProps) {
    return (
        <div className="dashboard-layout">
            <Sidebar role={role} />

            <Topbar role={role} />

            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;