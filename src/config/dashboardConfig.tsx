import { FiCheckCircle, FiTruck, FiClock, FiShoppingCart } from "react-icons/fi";
import { PiPlant } from "react-icons/pi"
import { LuPackage, LuPackageCheck  } from "react-icons/lu";
import type { ReactNode } from "react";

import type { ExecutorRole } from "../types/types";

export const DASHBOARD_CONFIG: Record<
    ExecutorRole,
    {
        description: string;
        stats: {
            label: string;
            value: number;
            icon: ReactNode;
        }[];
    }
> = {
    GROWER: {
        description:
            "Overview of your trace products and activities.",
        stats: [
            {
                label:
                    "Trace Products",
                value: 12,
                icon: (
                    <LuPackage
                        color="#2563EB"
                    />
                ),
            },
            {
                label:
                    "Harvesting Events",
                value: 12,
                icon: (
                    <PiPlant
                        color="#16A34A"
                    />
                ),
            },
            {
                label:
                    "Shipping Events",
                value: 8,
                icon: (
                    <FiTruck
                        color="#7C3AED"
                    />
                ),
            },
            {
                label:
                    "Signed Events",
                value: 20,
                icon: (
                    <FiCheckCircle
                        color="#16A34A"
                    />
                ),
            },
        ],
    },

    DISTRIBUTOR: {
        description:
            "Overview of your incoming and outgoing activities.",
        stats: [
            {
                label:
                    "Received Products",
                value: 18,
                icon: (
                    <LuPackageCheck
                        color="#2563EB"
                    />
                ),
            },
            {
                label:
                    "Shipping Events",
                value: 12,
                icon: (
                    <FiTruck
                        color="#7C3AED"
                    />
                ),
            },
            {
                label:
                    "Signed Events",
                value: 24,
                icon: (
                    <FiCheckCircle
                        color="#16A34A"
                    />
                ),
            },
            {
                label:
                    "Waiting to Receive Products",
                value: 6,
                icon: (
                    <FiClock
                        color="#F59E0B"
                    />
                ),
            },
        ],
    },

    RETAILER: {
        description:
            "Overview of your incoming products and activities.",
        stats: [
            {
                label:
                    "Received Products",
                value: 18,
                icon: (
                    <LuPackageCheck
                        color="#2563EB"
                    />
                ),
            },
            {
                label:
                    "Selling Events",
                value: 12,
                icon: (
                    <FiShoppingCart
                        color="#7C3AED"
                    />
                ),
            },
            {
                label:
                    "Signed Events",
                value: 24,
                icon: (
                    <FiCheckCircle
                        color="#16A34A"
                    />
                ),
            },
            {
                label:
                    "Waiting to Receive Products",
                value: 6,
                icon: (
                    <FiClock
                        color="#F59E0B"
                    />
                ),
            },
        ],
    },
};