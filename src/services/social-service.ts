import { httpClient } from "@/services/http-client";
import type {
  SocialConnectionStatusResponse,
  SocialConnectionUpsertRequest,
  SocialPlatform,
} from "@/types/api";

export async function getSocialConnectionStatus(platform: SocialPlatform, channelId?: string) {
  const { data } = await httpClient.get<SocialConnectionStatusResponse>(
    `/api/integrations/${platform}/connection`,
    {
      params: { channelId },
    },
  );
  return data;
}

export async function upsertSocialConnection(
  platform: SocialPlatform,
  payload: SocialConnectionUpsertRequest,
) {
  const { data } = await httpClient.post<SocialConnectionStatusResponse>(
    `/api/integrations/${platform}/connection`,
    payload,
  );
  return data;
}
