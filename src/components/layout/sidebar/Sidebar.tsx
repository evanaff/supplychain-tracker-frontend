import "./Sidebar.css";

import { useLocation, useNavigate } from "react-router-dom";

import {
    FiGrid,
    FiUsers,
    FiMapPin,
    FiPackage,
    FiSearch,
    FiLogOut,
} from "react-icons/fi";
import type { Role } from "../../../types/types";

interface SidebarProps {
    role: Role
}

interface MenuItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

function Sidebar({ role }: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuMap: Record<
        SidebarProps["role"],
        MenuItem[]
    > = {
        ADMIN: [
            {
                label: "Dashboard",
                path: "/admin/dashboard",
                icon: <FiGrid />,
            },
            {
                label: "Actors",
                path: "/admin/actors",
                icon: <FiUsers />,
            },
            {
                label: "Locations",
                path: "/admin/locations",
                icon: <FiMapPin />,
            },
        ],

        GROWER: [
            // {
            //     label: "Dashboard",
            //     path: "/grower/dashboard",
            //     icon: <FiGrid />,
            // },
            {
                label: "Trace Products",
                path: "/grower/trace-products",
                icon: <FiPackage />,
            },
            {
                label: "Scan Product",
                path: "/grower/scan",
                icon: <FiSearch />,
            },
        ],

        DISTRIBUTOR: [
            // {
            //     label: "Dashboard",
            //     path: "/distributor/dashboard",
            //     icon: <FiGrid />,
            // },
            {
                label: "Trace Products",
                path: "/distributor/trace-products",
                icon: <FiPackage />,
            },
            {
                label: "Scan Product",
                path: "/distributor/scan",
                icon: <FiSearch />,
            },
        ],

        RETAILER: [
            // {
            //     label: "Dashboard",
            //     path: "/retailer/dashboard",
            //     icon: <FiGrid />,
            // },
            {
                label: "Trace Products",
                path: "/retailer/trace-products",
                icon: <FiPackage />,
            },
            {
                label: "Scan Product",
                path: "/retailer/scan",
                icon: <FiSearch />,
            },
        ],
    };

    const menus = menuMap[role];

    function handleLogout() {
        localStorage.clear();

        navigate("/login");
    }

    return (
        <aside className="sidebar">
            {/* MENU */}
            <nav className="sidebar-menu">
                {menus.map((menu) => {
                    const isActive =
                        location.pathname ===
                        menu.path;

                    return (
                        <button
                            key={menu.path}
                            className={`sidebar-item ${
                                isActive
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                navigate(menu.path)
                            }
                        >
                            <span className="sidebar-icon">
                                {menu.icon}
                            </span>

                            <span>
                                {menu.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            {/* LOGOUT */}
            <div className="sidebar-footer">
                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    <FiLogOut />

                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;