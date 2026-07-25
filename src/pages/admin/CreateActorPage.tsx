import "./CreateActorPage.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import RoleLayout from "../../layouts/RoleLayout";

import PageHeader from "../../components/layout/page-header/PageHeader";
import Button from "../../components/common/button/Button";
import { type Role, type Location } from "../../types/types";
import { listLocations } from "../../api/locationApi";
import toast from "react-hot-toast";
import type { CreateActorDTO } from "../../types/dataTransferObjects";
import { createActor } from "../../api/actorApi";
import type { AxiosError } from "axios";

function CreateActorPage() {
    const navigate =
        useNavigate();

    const [blockchainAddress, setBlockchainAddress] =
        useState("");

    const [name, setName] = useState("");

    const [role, setRole] =useState<Role>("GROWER");

    const [locationSearch, setLocationSearch] = useState("");

    const [locationGln, setLocationGln] = useState("");

    const [locations, setLocations] = useState<Location[]>([]);
    
    const [isLocationOpen, setIsLocationOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchLocations = async (search?: string) => {
            try {
                const res = await listLocations({
                    page: 1,
                    limit: 5,
                    search
                });

                setLocations(res.data.locations);
            } catch (error) {
                console.error(error);

                toast.error(
                    "Failed to load locations"
                );
            }
        };

        const timer = setTimeout(() => {
            fetchLocations(locationSearch.trim() || undefined);
        }, 500);

        return () => clearTimeout(timer);
    }, [locationSearch]);

    async function handleSubmit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        if (
            !blockchainAddress.trim() ||
            !name.trim() ||
            !role.trim() ||
            !locationGln.trim() 
        ) {
            toast.error("All fields are required");
            return
        }

        try {
            setIsLoading(true);

            const payload: CreateActorDTO = {
                blockchainAddress,
                locationGln,
                name,
                role,
            };

            const res = await createActor(payload);

            toast.success(res.message);

            navigate("/admin/actors");
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            toast.error(axiosError.response?.data.message ?? "Failed to create actor");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <RoleLayout role="ADMIN">
            <div className="add-actor-container">
                <PageHeader
                    title="Add Actor"
                    description="
                        Register a new actor
                        to the system.
                    "
                />

                <form
                    className="add-actor-form"
                    onSubmit={
                        handleSubmit
                    }
                >
                    <div className="form-group">
                        <label>
                            Blockchain
                            Address
                        </label>

                        <input
                            type="text"
                            placeholder="0x..."
                            value={
                                blockchainAddress
                            }
                            onChange={(
                                event
                            ) =>
                                setBlockchainAddress(
                                    event
                                        .target
                                        .value
                                )
                            }
                        />

                        <small>
                            Must be a
                            valid Ethereum
                            wallet
                            address.
                        </small>
                    </div>

                    <div className="form-group">
                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter actor name"
                            value={name}
                            onChange={(
                                event
                            ) =>
                                setName(
                                    event
                                        .target
                                        .value
                                )
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Role
                        </label>

                        <div className="role-options">
                            <label className="role-option role-grower">
                                <input
                                    type="radio"
                                    name="role"
                                    value="GROWER"
                                    checked={
                                        role ===
                                        "GROWER"
                                    }
                                    onChange={() =>
                                        setRole(
                                            "GROWER"
                                        )
                                    }
                                />

                                <span>
                                    GROWER
                                </span>
                            </label>

                            <label className="role-option role-distributor">
                                <input
                                    type="radio"
                                    name="role"
                                    value="DISTRIBUTOR"
                                    checked={
                                        role ===
                                        "DISTRIBUTOR"
                                    }
                                    onChange={() =>
                                        setRole(
                                            "DISTRIBUTOR"
                                        )
                                    }
                                />

                                <span>
                                    DISTRIBUTOR
                                </span>
                            </label>

                            <label className="role-option role-retailer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="RETAILER"
                                    checked={
                                        role ===
                                        "RETAILER"
                                    }
                                    onChange={() =>
                                        setRole(
                                            "RETAILER"
                                        )
                                    }
                                />

                                <span>
                                    RETAILER
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            Location
                        </label>

                        <input
                            type="text"
                            placeholder="Search location..."
                            value={locationSearch}
                            onFocus={() => setIsLocationOpen(true)}
                            onChange={(event) => {
                                setLocationSearch(
                                    event.target.value
                                );
                                setLocationGln("");
                            }}
                        />

                        {
                            isLocationOpen && locations.length > 0 && !locationGln && (
                            <div className="location-picker-list">
                                {locations.map(
                                    (location) => (
                                        <button
                                            key={
                                                location.gln
                                            }
                                            type="button"
                                            className={`location-option ${
                                                locationGln === location.gln
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                setLocationGln(
                                                    location.gln
                                                );

                                                setLocationSearch(`${location.name} (${location.allowedRole})`);

                                                setLocations([]);

                                                setIsLocationOpen(false);
                                            }}
                                        >
                                            {
                                                `${location.name} (${location.allowedRole})`
                                            }
                                        </button>
                                    )
                                )}
                            </div>
                            )
                        }
                    </div>

                    <div className="form-actions">
                        <Button
                            variant="secondary"
                            onClick={() =>
                                navigate(
                                    "/admin/actors"
                                )
                            }
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {
                                isLoading
                                    ? "Creating..."
                                    : "Create"
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </RoleLayout>
    );
}

export default CreateActorPage;