import "./LocationListPage.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import RoleLayout from "../../layouts/RoleLayout";
import PageHeader from "../../components/layout/page-header/PageHeader";
import Button from "../../components/common/button/Button";
import Pagination from "../../components/common/pagination/Pagination";

import {
    FiPlus,
    FiSearch,
} from "react-icons/fi";

import { type Location, type Role } from "../../types/types";
import { listLocations } from "../../api/locationApi";
import Badge from "../../components/common/badge/Badge";

function LocationListPage() {
    const navigate =
        useNavigate();

    const [locations, setLocations] = useState<Location[]>([]);

    const [totalPages, setTotalPages] = useState(1);

    const [totalItems, setTotalItems] = useState(0);

    const [page, setPage] = useState(1);

    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await listLocations({
                    page,
                    limit: 10,
                    search
                });
                
                setLocations(res.data.locations);
                setTotalPages(res.data.pagination.totalPages);
                setTotalItems(res.data.pagination.totalItems);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLocations();
    }, [page, search]);

    function getBadgeVariant(
        role: Role
    ) {
        switch (role) {
            case "GROWER":
                return "success";

            case "DISTRIBUTOR":
                return "info";

            case "RETAILER":
                return "purple";

            default:
                return "gray";
        }
    }

    return (
        <RoleLayout role="ADMIN">
            <PageHeader
                title="Locations"
                description="
                    Manage all
                    locations in
                    the supply
                    chain.
                "
                action={
                    <Button
                        iconLeft={
                            <FiPlus />
                        }
                        onClick={() =>
                            navigate(
                                "/admin/locations/add"
                            )
                        }
                    >
                        Add Location
                    </Button>
                }
            />

            <section className="location-list-card">
                <div className="location-list-toolbar">
                    <div className="search-input-wrapper">
                        <FiSearch />

                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(event) => {
                                setPage(1);
                                setSearch(event.target.value);
                            }}
                        />
                    </div>

                    <p className="location-total">
                        Total: {totalItems}
                        locations
                    </p>
                </div>

                <div className="location-table-wrapper">
                    <table className="location-table">
                        <thead>
                            <tr>
                                <th>
                                    GLN
                                </th>

                                <th>
                                    Location Name
                                </th>

                                <th>
                                    Allowed Role
                                </th>

                                <th>
                                    Province
                                </th>

                                <th>
                                    City
                                </th>

                                <th>
                                    Address
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {locations.map(
                                (
                                    location
                                ) => (
                                    <tr
                                        key={
                                            location.gln
                                        }
                                    >
                                        <td>
                                            {
                                                location.gln
                                            }
                                        </td>

                                        <td>
                                            {
                                                location.name
                                            }
                                        </td>

                                        <td>
                                            <Badge
                                                variant={getBadgeVariant(location.allowedRole)}
                                            >
                                                {location.allowedRole}
                                            </Badge>
                                        </td>

                                        <td>
                                            {
                                                location.province
                                            }
                                        </td>

                                        <td>
                                            {
                                                location.city
                                            }
                                        </td>

                                        <td>
                                            {
                                                location.address
                                            }
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

export default LocationListPage;