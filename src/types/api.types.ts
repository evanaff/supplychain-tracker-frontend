export interface Pagination {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    status: 'success' | 'fail' | 'error';
    data: T;
}

export interface PaginatedResponse<T> {
    status: 'success';
    data: T & { pagination: Pagination };
}

export interface ApiError {
    status: 'fail' | 'error';
    message: string;
}
