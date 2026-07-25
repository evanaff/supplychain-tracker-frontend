import "./CreateLocationPage.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import RoleLayout from "../../layouts/RoleLayout";

import PageHeader from "../../components/layout/page-header/PageHeader";
import Button from "../../components/common/button/Button";

import { createLocation } from "../../api/locationApi";
import type { CreateLocationDTO } from "../../types/dataTransferObjects";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { Role } from "../../types/types";

function CreateLocationPage() {
    const navigate =
        useNavigate();

    const [gln, setGln] =
        useState("");

    const [name, setName] =
        useState("");

    const [province, setProvince] =
        useState("");

    const [city, setCity] =
        useState("");

    const [address, setAddress] =
        useState("");

    const [allowedRole, setAllowedRole] =useState<Role>("GROWER");

    const [isLoading, setIsLoading] =
        useState(false);

    async function handleSubmit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        if (
            !gln.trim() ||
            !name.trim() ||
            !province.trim() ||
            !city.trim() ||
            !address.trim()
        ) {
            toast.error("All fields are required");
            return;
        }

        try {
            setIsLoading(true)
            
            const payload: CreateLocationDTO = {
                gln,
                name,
                province,
                city,
                address,
                allowedRole
            };

            const res = await createLocation(payload);

            toast.success(
                res.message
            );

            navigate("/admin/locations");
        } catch (error) {
            const axiosError = error as AxiosError<{
                message: string
            }>;
            toast.error(axiosError.response?.data.message ?? "Failed to create location");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <RoleLayout role="ADMIN">
            <div className="add-location-container">
                <PageHeader
                    title="Create Location"
                    description="
                        Register a new
                        location to
                        the system.
                    "
                />

                <form
                    className="add-location-form"
                    onSubmit={
                        handleSubmit
                    }
                >
                    <div className="form-group">
                        <label>
                            GLN
                        </label>

                        <input
                            type="text"
                            placeholder="Enter 13-digit GLN"
                            value={gln}
                            onChange={(
                                event
                            ) =>
                                setGln(
                                    event
                                        .target
                                        .value
                                )
                            }
                        />

                        <small>
                            Must contain
                            13 digits.
                        </small>
                    </div>

                    <div className="form-group">
                        <label>
                            Location Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter location name"
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
                            Allowed Role
                        </label>

                        <div className="role-options">
                            <label className="role-option role-grower">
                                <input
                                    type="radio"
                                    name="role"
                                    value="GROWER"
                                    checked={
                                        allowedRole ===
                                        "GROWER"
                                    }
                                    onChange={() =>
                                        setAllowedRole(
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
                                        allowedRole ===
                                        "DISTRIBUTOR"
                                    }
                                    onChange={() =>
                                        setAllowedRole(
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
                                        allowedRole ===
                                        "RETAILER"
                                    }
                                    onChange={() =>
                                        setAllowedRole(
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

                    <div className="location-grid">
                        <div className="form-group">
                            <label>
                                Province
                            </label>

                            <input
                                type="text"
                                placeholder="Enter province"
                                value={
                                    province
                                }
                                onChange={(
                                    event
                                ) =>
                                    setProvince(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                City
                            </label>

                            <input
                                type="text"
                                placeholder="Enter city"
                                value={city}
                                onChange={(
                                    event
                                ) =>
                                    setCity(
                                        event
                                            .target
                                            .value
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            Address
                        </label>

                        <textarea
                            placeholder="Enter full address"
                            value={
                                address
                            }
                            onChange={(
                                event
                            ) =>
                                setAddress(
                                    event
                                        .target
                                        .value
                                )
                            }
                        />
                    </div>

                    <div className="form-actions">
                        <Button
                            variant="secondary"
                            onClick={() =>
                                navigate(
                                    "/admin/locations"
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

export default CreateLocationPage;