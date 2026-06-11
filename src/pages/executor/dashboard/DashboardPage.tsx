import "./DashboardPage.css";

import RoleLayout from "../../../layouts/RoleLayout";

import PageHeader from "../../../components/layout/page-header/PageHeader";
import StatsCard from "../../../components/common/stats-card/StatsCard";

import { DASHBOARD_CONFIG } from "../../../config/dashboardConfig";
import type { ExecutorRole } from "../../../types/types";

interface DashboardPageProps {
    role: ExecutorRole
}

function DashboardPage({
    role,
}: DashboardPageProps) {
    const config =
        DASHBOARD_CONFIG[role];

    return (
        <RoleLayout role={role}>
            <PageHeader
                title="Dashboard"
                description={
                    config.description
                }
            />

            <section className="dashboard-stats-grid">
                {config.stats.map(
                    (stat) => (
                        <StatsCard
                            key={
                                stat.label
                            }
                            icon={
                                stat.icon
                            }
                            value={
                                stat.value
                            }
                            label={
                                stat.label
                            }
                        />
                    )
                )}
            </section>
        </RoleLayout>
    );
}

export default DashboardPage;