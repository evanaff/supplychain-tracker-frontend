import api from "./axios";
import type { CreateLocationDTO, ListLocationsQueryDTO } from "../types/dataTransferObjects";

export async function createLocation(payload: CreateLocationDTO) {
    const res = await api.post(
        "/locations",
        payload,
    );

    return res.data;
}

export async function listLocations(query: ListLocationsQueryDTO) {
    const res = await api.get(
        "/locations",
        { params: query }
    );

    return res.data;
}