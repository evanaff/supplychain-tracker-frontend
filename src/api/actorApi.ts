import api from "./axios";
import type { CreateActorDTO, ListActorsQueryDTO } from "../types/dataTransferObjects";

export async function createActor(payload: CreateActorDTO) {
  const res = await api.post(
    `/actors`,
    payload,
  );

  return res.data;
}

export async function listActors(query: ListActorsQueryDTO) {
  const res = await api.get(
    `/actors`,
    { params: query }
  );

  return res.data;
}