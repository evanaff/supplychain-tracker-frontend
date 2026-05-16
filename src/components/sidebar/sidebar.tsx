import { Link, useLocation } from "react-router-dom";

import {
  Users,
  Package,
  LayoutDashboard,
  PackageSearch,
  PlusSquare,
  Truck,
} from "lucide-react";

import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  const role =
    localStorage.getItem("role") || "";

  const menus = {
    ADMIN: [
      {
        label: "Actors",
        path: "/admin/actors",
        icon: <Users size={24} />,
      },

      {
        label: "Products",
        path: "/admin/products",
        icon: <Package size={24} />,
      },
    ],

    GROWER: [
      {
        label: "Trace Product",
        path: "/grower/trace-products",
        icon: <PackageSearch size={24} />,
      },

      {
        label: "Add Trace Product",
        path: "/grower/add-trace-product",
        icon: <PlusSquare size={24} />,
      },

      {
        label: "Shipping",
        path: "/grower/shipping",
        icon: <Truck size={24} />,
      },
    ],

    DISTRIBUTOR: [
      {
        label: "Dashboard",
        path: "/distributor",
        icon: (
          <LayoutDashboard size={24} />
        ),
      },
    ],

    RETAILER: [
      {
        label: "Dashboard",
        path: "/retailer",
        icon: (
          <LayoutDashboard size={24} />
        ),
      },
    ],
  };

  const currentMenus =
    menus[
      role as keyof typeof menus
    ] || [];

  return (
    <aside className="sidebar">
      {currentMenus.map((menu) => {
        const isActive =
          location.pathname === menu.path;

        return (
          <Link
            key={menu.path}
            to={menu.path}
            className={`sidebar-item ${
              isActive ? "active" : ""
            }`}
          >
            <div className="sidebar-icon">
              {menu.icon}
            </div>

            <span>{menu.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}