import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

function getAuthHeader() {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getTraceProducts() {
  const res = await axios.get(`${apiUrl}/traces/products`,
    getAuthHeader()
  );

  console.log(res.data.data);

  return res.data.data;
}

export async function createInitialProduct(gtin: string) {
  const res = await axios.post(`${apiUrl}/traces/products/${gtin}/initial`,
    {},
    getAuthHeader()
  );

  console.log(res);
  return res.data.data;
}

export async function searchTraceProducts(keyword: string) {
  const res = await axios.get(`${apiUrl}/traces/products/search?keyword=${keyword}`,
    getAuthHeader()
  );

  return res.data.data;
}

export async function getLastTraceEvent(traceProductId: number) {
  const res = await axios.get(`${apiUrl}/traces/products/${traceProductId}/last-event`,
    getAuthHeader()
  );

  return res.data.data;
}

export async function saveTraceEventToBlockchain(traceEventId: number, signature: string) {
  const res = await axios.post(`${apiUrl}/traces/events/${traceEventId}/blockchain`,
    {
      signature
    },
    getAuthHeader()
  );

  console.log(`blockchain save: ${res}`);

  return res.data.data;
}

export async function shippingProduct(traceProductId: number) {
  const res = await axios.post(
    `${apiUrl}/traces/products/${traceProductId}/shipping`,
    {},
    getAuthHeader()
  );

  return res.data.data;
}

export async function receiveProduct(
  productId: number,
  payload: {
    notes: string;
  }
) {
  const res = await axios.post(
    `${apiUrl}/products/${productId}/receiving`,
    payload,
    getAuthHeader()
  );

  return res.data.data;
}

export async function getProductHistory(productId: number) {
  const res = await axios.get(
    `${apiUrl}/products/${productId}/history`
  );

  return res.data.data;
}

export async function verifyTraceEvent(eventId: number) {
  const res = await axios.get(
    `${apiUrl}/products/trace-event/${eventId}/verify`
  );

  return res.data.data;
}