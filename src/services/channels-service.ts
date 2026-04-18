import { httpClient } from "@/services/http-client";
import type { Channel } from "@/types/api";

export interface CreateChannelRequest {
  name: string;
  description?: string;
}

export async function listChannels() {
  const { data } = await httpClient.get<Channel[]>("/api/channels");
  return data;
}

export async function createChannel(payload: CreateChannelRequest) {
  const { data } = await httpClient.post<Channel>("/api/channels", payload);
  return data;
}
