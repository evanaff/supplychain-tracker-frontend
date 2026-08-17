import { useState } from 'react';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export interface PaginationState {
    page: number;
    limit: number;
}

export interface PaginationActions {
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    reset: () => void;
}

export function usePagination(
    initialPage = DEFAULT_PAGE,
    initialLimit = DEFAULT_LIMIT,
): PaginationState & PaginationActions {
    const [page, setPageState] = useState(initialPage);
    const [limit, setLimitState] = useState(initialLimit);

    const setPage = (newPage: number) => setPageState(newPage);

    const setLimit = (newLimit: number) => {
       setLimitState(newLimit);
       setPageState(1);
    };

    const reset = () => {
       setPageState(initialPage);
       setLimitState(initialLimit);
    };

    return { page, limit, setPage, setLimit, reset };
}
