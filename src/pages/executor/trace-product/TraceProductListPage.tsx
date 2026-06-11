import "./TraceProductListPage.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiSearch } from "react-icons/fi";

import RoleLayout from "../../../layouts/RoleLayout";
import PageHeader from "../../../components/layout/page-header/PageHeader";
import Button from "../../../components/common/button/Button";
import Badge from "../../../components/common/badge/Badge";
import Pagination from "../../../components/common/pagination/Pagination";
import { TRACE_PRODUCT_LIST_CONFIG } from "../../../config/traceProductListConfig";
import type { ExecutorRole, SupplyChainActivity, TraceProduct } from "../../../types/types";
import { listTraceProducts } from "../../../api/traceApi";
import { timestampToDate } from "../../../utils";

interface Props {
    role: ExecutorRole;
}

function TraceProductListPage({
    role,
}: Props) {
    const navigate =
        useNavigate();

    const config =TRACE_PRODUCT_LIST_CONFIG[role];

    const [traceProducts, setTraceProducts] = useState<TraceProduct[]>([]);

    const [totalPages, setTotalPages] = useState(1);

    const [totalItems, setTotalItems] = useState(0);

    const [page, setPage] = useState(1);

    const [search, setSearch] = useState("");

    const [activityFilter, setActivityFilter] = useState<SupplyChainActivity | "CREATED">();

    useEffect(() => {
        const fetchTraceProducts = async () => {
            try {
                const res = await listTraceProducts({
                    page,
                    limit: 10,
                    search,
                    filter: activityFilter
                });

                setTraceProducts(res.data.traceProducts);
                setTotalPages(res.data.pagination.totalPages);
                setTotalItems(res.data.pagination.totalItems);
            } catch (error) {
                console.error(error);
            }
        }
        fetchTraceProducts();
    }, [page, search, activityFilter]);

    function getBadgeVariant(
        activity: SupplyChainActivity
    ) {
        switch (
            activity
        ) {
            case "HARVESTING":
                return "success";

            case "SHIPPING":
                return "info";

            case "RECEIVING":
                return "warning";

            case "SELLING":
                return "purple";

            default:
                return "gray";
        }
    }

    return (
        <RoleLayout role={role}>
            <PageHeader
                title="Trace Product List"
                description={
                    config.description
                }
                action={
                    config.actionButton ? (     
                        <Button
                            iconLeft={
                                <FiPlus />
                            }
                            onClick={() =>
                                navigate(config.actionButton!.path)
                            }
                        >
                            {config.actionButton.label}
                        </Button>
                    ) : undefined
                }
            />

            <section className="trace-product-list-card">
                <div className="trace-product-toolbar">
                    <div className="trace-product-toolbar-left">
                        <div className="search-input-wrapper">
                            <FiSearch />

                            <input
                                type="text"
                                placeholder="Search by ID or Lot Number..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="trace-product-toolbar-right">
                        {config.showStatus && (
                            <select
                                className="trace-product-status-filter"
                                value={activityFilter}
                                onChange={(event) => {
                                    setActivityFilter(event.target.value as SupplyChainActivity | "CREATED")
                                }}
                            >
                                <option value={""}>
                                    All Activity
                                </option>

                                <option value={"CREATED"}>
                                    CREATED
                                </option>

                                <option value={"HARVESTING"}>
                                    HARVESTING
                                </option>

                                <option value={"SHIPPING"}>
                                    SHIPPING
                                </option>

                                <option value={"RECEIVING"}>
                                    RECEIVING
                                </option>

                                <option value={"SELLING"}>
                                    SELLING
                                </option>
                            </select>
                        )}

                        <p className="trace-product-total">
                            Total {totalItems} trace products
                        </p>
                    </div>
                </div>

                <div className="trace-product-table-wrapper">
                    <table className="trace-product-table">
                        <thead>
                            <tr>
                                <th>
                                    ID
                                </th>

                                <th>
                                    Variety Name
                                </th>

                                <th>
                                    Lot Number
                                </th>

                                <th>
                                    Quantity
                                </th>

                                {config.showStatus && (
                                    <th>
                                        Current Activity
                                    </th>
                                )}

                                <th>
                                    Created At
                                </th>

                                <th>
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {traceProducts.map(
                                (
                                    traceProduct
                                ) => (
                                    <tr
                                        key={traceProduct.id}
                                    >
                                        <td>
                                            {traceProduct.id}
                                        </td>

                                        <td>
                                            {traceProduct.product.varietyName}
                                        </td>

                                        <td>
                                            {traceProduct.lotNumber}
                                        </td>

                                        <td>
                                            {traceProduct.quantity} {traceProduct.product.unitOfMeasure}
                                        </td>

                                        {config.showStatus && (
                                            <td>
                                                <Badge
                                                    variant={getBadgeVariant(
                                                        traceProduct.currentActivity
                                                    )}
                                                >
                                                    {traceProduct.currentActivity}
                                                </Badge>
                                            </td>
                                        )}

                                        <td>
                                            {timestampToDate(traceProduct.createdAt)}
                                        </td>

                                        <td>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => 
                                                    navigate(`${config.viewDetailButton.path}/${traceProduct.id}`)
                                                }
                                            >
                                                View
                                                Details
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </section>
        </RoleLayout>
    );
}

export default TraceProductListPage;