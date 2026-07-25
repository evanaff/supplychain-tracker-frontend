import type { Role } from "../types/types";

export const TRACE_PRODUCT_LIST_CONFIG:
    Record<
        Role,
        {
            description: string;       
            actionButton?: {
                label: string;
                path: string;
            };
            viewDetailButton: {
                path: string
            };
        }
    > = {
        ADMIN: {
            description: "List of all trace products",
            viewDetailButton: {
                path: "/admin/trace-products"
            },
        },
    GROWER: {
        description: "List of trace products created by you.",
        actionButton: {
            label: "Create Trace Product",
            path: "/grower/trace-products/create",
        },
        viewDetailButton: {
            path: "/grower/trace-products"
        },
    },

    DISTRIBUTOR: {
        description: "List of trace products you have received or are managing.",
        viewDetailButton: {
            path: "/distributor/trace-products"
        },
    },

    RETAILER: {
        description: "List of trace products you have received or are managing.",
        viewDetailButton: {
            path: "/retailer/trace-products"
        },
    },
};