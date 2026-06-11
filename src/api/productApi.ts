import api from "./axios";
import type { ListProductsQueryDTO } from "../types/dataTransferObjects";

export async function listProducts(query: ListProductsQueryDTO) {
    const res = await api.get(
        "/products",
        { params: query }
    )

    return res.data;
}