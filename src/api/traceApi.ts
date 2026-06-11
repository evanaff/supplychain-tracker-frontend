import api from "./axios";
import type { CreateTraceEventDTO, CreateTraceProductDTO, ListTraceProductsQueryDTO, SubmitTraceEventDTO } from "../types/dataTransferObjects";

export async function getAdminDashboard() {
    const res = await api.get("/traces/dashboard/admin");

    return res.data;
}

// =====================
// Trace Products
// =====================

export async function createTraceProduct(payload: CreateTraceProductDTO) {
    const res = await api.post(
        "/traces/trace-products",
        payload
    );
    
    return res.data;
}

export async function listTraceProducts(query: ListTraceProductsQueryDTO) {
    const res = await api.get(
        "/traces/trace-products",
        { params: query }
    );
    
    return res.data;
}

export async function getTraceProductById(id: string) {
    const res = await api.get(`/traces/trace-products/${id}`);
    
    return res.data;
}

export async function getTraceProductHistory(id: string) {
    const res = await api.get(`/traces/trace-products/${id}/history`);
    
    return res.data;
}

// =====================
// Trace Events
// =====================

export async function createHarvestingEvent(payload: CreateTraceEventDTO) {
    const res = await api.post(
        "/traces/trace-events/harvesting",
        payload
    );
    
    return res.data
}

export async function createShippingEvent(payload: CreateTraceEventDTO) {
    const res = await api.post(
        "/traces/trace-events/shipping",
        payload
    );
    
    return res.data
}

export async function createReceivingEvent(payload: CreateTraceEventDTO) {
    const res = await api.post(
        "/traces/trace-events/receiving",
        payload
    );
    
    return res.data
}

export async function createSellingEvent(payload: CreateTraceEventDTO) {
    const res = await api.post(
        "/traces/trace-events/selling",
        payload
    );
    
    return res.data
}

export async function getTraceEventById(id: string) {
    const res = await api.get(`/traces/trace-events/${id}`);
    
    return res.data;
}

export async function generateMessageHash(id: string) {
    const res = await api.get(`traces/trace-events/${id}/message-hash`);

    return res.data;
}

export async function submitTraceEvent(
    id:string,
    payload: SubmitTraceEventDTO
) {
    const res = await api.post(
        `/traces/trace-events/${id}/submit`,
        payload
    );

    return res.data;
}