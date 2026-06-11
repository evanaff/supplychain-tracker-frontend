import "./RoleLayout.css";

import Sidebar from "../components/layout/sidebar/Sidebar";
import Topbar from "../components/layout/topbar/Topbar";
import type { Role } from "../types/types";

interface RoleLayoutProps {
    children: React.ReactNode;
    role: Role
}

function RoleLayout({
    children,
    role,
}: RoleLayoutProps) {
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

export default RoleLayout;