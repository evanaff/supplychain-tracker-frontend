import "./ActorListPage.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiSearch } from "react-icons/fi";

import RoleLayout from "../../layouts/RoleLayout";
import PageHeader from "../../components/layout/page-header/PageHeader";
import Button from "../../components/common/button/Button";
import Badge from "../../components/common/badge/Badge";
import Pagination from "../../components/common/pagination/Pagination";
import { listActors } from "../../api/actorApi";
import { type Actor, type Role } from "../../types/types";

function ActorListPage() {
    const navigate =
        useNavigate();

    const [actors, setActors] = useState<Actor[]>([]);

    const [totalPages, setTotalPages] = useState(1);

    const [totalItems, setTotalItems] = useState(0);

    const [page, setPage] = useState(1);

    const [search, setSearch] = useState("");

    const [roleFilter, setRoleFilter] = useState<Role | "">("");

    useEffect(() => {
        const fetchActors = async () => {
            try {
                const res = await listActors({
                    page,
                    limit: 10,
                    search,
                    filter: roleFilter || undefined
                });

                setActors(res.data.actors);
                setTotalPages(res.data.pagination.totalPages);
                setTotalItems(res.data.pagination.totalItems);
            } catch (error) {
                console.error(error);
            }
        };
        fetchActors();
    }, [page, search, roleFilter]);

    function getBadgeVariant(
        role: Actor["role"]
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
                title="Actors"
                description="
                    Manage all actors
                    in the supply chain.
                "
                action={
                    <Button
                        iconLeft={
                            <FiPlus />
                        }
                        onClick={() =>
                            navigate(
                                "/admin/actors/add"
                            )
                        }
                    >
                        Add Actor
                    </Button>
                }
            />

            <section className="actor-list-card">
                <div className="actor-list-toolbar">
                    <div className="actor-list-filters">
                        <div className="search-input-wrapper">
                            <FiSearch />

                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => {
                                    setPage(1);
                                    setSearch(e.target.value);
                                }}
                            />
                        </div>

                        <select
                            className="role-filter"
                            value={roleFilter}
                            onChange={(event) => {
                                setPage(1);
                                setRoleFilter(event.target.value as Role | "");
                            }}
                        >
                            <option value="">
                                All Roles
                            </option>

                            <option value="ADMIN">
                                Admin
                            </option>

                            <option value="GROWER">
                                Grower
                            </option>

                            <option value="DISTRIBUTOR">
                                Distributor
                            </option>

                            <option value="RETAILER">
                                Retailer
                            </option>
                        </select>
                    </div>

                    <p className="actor-total">
                        Total: {totalItems} actors
                    </p>
                </div>

                <div className="actor-table-wrapper">
                    <table className="actor-table">
                        <thead>
                            <tr>
                                <th>
                                    Blockchain
                                    Address
                                </th>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Role
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {actors.map(
                                (
                                    actor
                                ) => (
                                    <tr
                                        key={
                                            actor.blockchainAddress
                                        }
                                    >
                                        <td>
                                            {
                                                actor.blockchainAddress
                                            }
                                        </td>

                                        <td>
                                            {
                                                actor.name
                                            }
                                        </td>

                                        <td>
                                            <Badge
                                                variant={getBadgeVariant(
                                                    actor.role
                                                )}
                                            >
                                                {
                                                    actor.role
                                                }
                                            </Badge>
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

export default ActorListPage;