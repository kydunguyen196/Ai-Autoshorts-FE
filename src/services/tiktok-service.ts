import { httpClient } from "@/services/http-client";
import type {
  TikTokConnectionStatusResponse,
  TikTokConnectionUpsertRequest,
} from "@/types/api";

export async function getTikTokConnectionStatus(channelId?: string) {
  const { data } = await httpClient.get<TikTokConnectionStatusResponse>(
    "/api/integrations/tiktok/connection",
    {
      params: { channelId },
    },
  );
  return data;
}

export async function upsertTikTokConnection(payload: TikTokConnectionUpsertRequest) {
  const { data } = await httpClient.post<TikTokConnectionStatusResponse>(
    "/api/integrations/tiktok/connection",
    payload,
  );
  return data;
}
