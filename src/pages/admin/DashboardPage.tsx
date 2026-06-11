import "./DashboardPage.css";

import RoleLayout from "../../layouts/RoleLayout";

import PageHeader from "../../components/layout/page-header/PageHeader";
import StatsCard from "../../components/common/stats-card/StatsCard";
import QuickActionCard from "../../components/common/quick-action-card/QuickActionCard";

import {
    FiMapPin,
    FiShoppingCart,
    FiUsers,
} from "react-icons/fi";

import { PiPlant } from "react-icons/pi";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../api/traceApi";

import { type DashboardStats } from "../../types/types";

function DashboardPage() {
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState<DashboardStats>();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setIsLoading(true);

                const res = await getAdminDashboard();

                setDashboardData(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboard();
    }, []);

    const stats = [
        {
            label: "Growers",
            value: dashboardData?.totalGrowers || 0,
            icon: (
                <PiPlant
                    color="#16A34A"
                />
            ),
        },
        {
            label: "Distributors",
            value: dashboardData?.totalDistributors || 0,
            icon: (
                <FiUsers
                    color="#2563EB"
                />
            ),
        },
        {
            label: "Retailers",
            value: dashboardData?.totalRetailers || 0,
            icon: (
                <FiShoppingCart
                    color="#7C3AED"
                />
            ),
        },
        {
            label: "Locations",
            value: dashboardData?.totalLocations || 0,
            icon: (
                <FiMapPin
                    color="#16A34A"
                />
            ),
        },
    ];

    return (
        <RoleLayout role="ADMIN">
            <PageHeader
                title="Dashboard"
                description="
                    Overview of master
                    data in the system.
                "
            />

            <section className="admin-stats-grid">
                {stats.map(
                    (stat) => (
                        <StatsCard
                            key={
                                stat.label
                            }
                            icon={
                                stat.icon
                            }
                            value={
                                isLoading
                                    ? "-"
                                    : stat.value.toString()
                            }
                            label={
                                stat.label
                            }
                        />
                    )
                )}
            </section>

            <section className="quick-actions-card">
                <h2>
                    Quick Actions
                </h2>

                <div className="quick-actions-grid">
                    <QuickActionCard
                        icon={<FiUsers />}
                        title="Add Actor"
                        description="
                            Register a new actor
                        "
                        onClick={() => {
                            navigate("/admin/actors/add")
                        }}
                    />

                    <QuickActionCard
                        icon={<FiMapPin />}
                        title="Add Location"
                        description="
                            Register a new location
                        "
                        onClick={() => {
                            navigate("/admin/locations/add")
                        }}
                    />
                </div>
            </section>

            <footer className="dashboard-footer">
                © 2026 Supply Chain
                Tracker
            </footer>
        </RoleLayout>
    );
}

export default DashboardPage;