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

export async function getActors() {
  const res = await axios.get(
    `${apiUrl}/actors`,
    getAuthHeader()
  );

  return res.data.data.actors;
}

export async function addActor(payload: {
  blockchainAddress: string;
  role: string;
  actorName: string;
  location: {
    locationName: string;
    address: string;
  };
}) {
  const res = await axios.post(
    `${apiUrl}/actors`,
    payload,
    getAuthHeader()
  );

  return res.data.data.actor;
}