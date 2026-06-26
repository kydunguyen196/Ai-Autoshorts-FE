import { httpClient } from "@/services/http-client";
import type { VideoTemplate, VideoTemplateRequest } from "@/types/api";

export async function listTemplates() {
  const { data } = await httpClient.get<VideoTemplate[]>("/api/templates");
  return data;
}

export async function createTemplate(payload: VideoTemplateRequest) {
  const { data } = await httpClient.post<VideoTemplate>("/api/templates", payload);
  return data;
}

export async function updateTemplate(templateId: string, payload: VideoTemplateRequest) {
  const { data } = await httpClient.put<VideoTemplate>(`/api/templates/${templateId}`, payload);
  return data;
}

export async function deleteTemplate(templateId: string) {
  await httpClient.delete(`/api/templates/${templateId}`);
}
