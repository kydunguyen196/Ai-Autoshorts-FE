import { httpClient } from "@/services/http-client";
import type {
  CharacterCampaign,
  CharacterCampaignUpsertRequest,
  CharacterProfile,
  CharacterProfileUpsertRequest,
} from "@/types/api";

export async function listCharacterProfiles(channelId?: string) {
  const { data } = await httpClient.get<CharacterProfile[]>("/api/characters/profiles", {
    params: { channelId },
  });
  return data;
}

export async function getCharacterProfile(profileId: string) {
  const { data } = await httpClient.get<CharacterProfile>(`/api/characters/profiles/${profileId}`);
  return data;
}

export async function createCharacterProfile(payload: CharacterProfileUpsertRequest) {
  const { data } = await httpClient.post<CharacterProfile>("/api/characters/profiles", payload);
  return data;
}

export async function updateCharacterProfile(profileId: string, payload: CharacterProfileUpsertRequest) {
  const { data } = await httpClient.put<CharacterProfile>(`/api/characters/profiles/${profileId}`, payload);
  return data;
}

export async function deleteCharacterProfile(profileId: string) {
  await httpClient.delete(`/api/characters/profiles/${profileId}`);
}

export async function listCharacterCampaigns(channelId?: string) {
  const { data } = await httpClient.get<CharacterCampaign[]>("/api/characters/campaigns", {
    params: { channelId },
  });
  return data;
}

export async function getCharacterCampaign(campaignId: string) {
  const { data } = await httpClient.get<CharacterCampaign>(`/api/characters/campaigns/${campaignId}`);
  return data;
}

export async function createCharacterCampaign(payload: CharacterCampaignUpsertRequest) {
  const { data } = await httpClient.post<CharacterCampaign>("/api/characters/campaigns", payload);
  return data;
}

export async function updateCharacterCampaign(
  campaignId: string,
  payload: CharacterCampaignUpsertRequest,
) {
  const { data } = await httpClient.put<CharacterCampaign>(`/api/characters/campaigns/${campaignId}`, payload);
  return data;
}

export async function deleteCharacterCampaign(campaignId: string) {
  await httpClient.delete(`/api/characters/campaigns/${campaignId}`);
}
