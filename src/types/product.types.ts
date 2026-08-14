export interface Product {
    gtin: string;
    varietyName: string;
    unitOfMeasure: string;
    imageUrl: string;
}

export interface ProductSnapshot {
    gtin: string;
    varietyName: string;
    unitOfMeasure: string;
    imageUrl: string;
}

export interface ProductFilters {
    page?: number;
    limit?: number;
    search?: string;
}
