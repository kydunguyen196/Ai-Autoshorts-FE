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

export interface BrandKitRequest {
  brandLogoUrl?: string;
  brandPrimaryColor?: string;
  brandAccentColor?: string;
  brandIntroUrl?: string;
  brandOutroUrl?: string;
}

export async function updateChannelBrandKit(channelId: string, payload: BrandKitRequest) {
  const { data } = await httpClient.put<Channel>(`/api/channels/${channelId}/brand-kit`, payload);
  return data;
}
