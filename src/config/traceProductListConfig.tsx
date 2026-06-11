import type { ExecutorRole } from "../types/types";

export const TRACE_PRODUCT_LIST_CONFIG:
    Record<
        ExecutorRole,
        {
            description: string;       
            actionButton?: {
                label: string;
                path: string;
            };
            viewDetailButton: {
                path: string
            };
            showStatus: boolean;
        }
    > = {
    GROWER: {
        description: "List of trace products created by you.",
        actionButton: {
            label: "Create Trace Product",
            path: "/grower/trace-products/create",
        },
        viewDetailButton: {
            path: "/grower/trace-products"
        },
        showStatus: true,
    },

    DISTRIBUTOR: {
        description: "List of trace products you have received or are managing.",
        viewDetailButton: {
            path: "/distributor/trace-products"
        },
        showStatus: true,
    },

    RETAILER: {
        description: "List of trace products you have received or are managing.",
        viewDetailButton: {
            path: "/retailer/trace-products"
        },
        showStatus: true,
    },
};