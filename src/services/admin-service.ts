import { httpClient } from "@/services/http-client";
import type {
  AdminOverview,
  AdminUser,
  AppSetting,
  NewsItem,
  NewsSource,
  PagedResponse,
  VideoJob,
} from "@/types/api";

export async function getAdminOverview() {
  const { data } = await httpClient.get<AdminOverview>("/api/admin/overview");
  return data;
}

export async function listAdminUsers(params: { search?: string; page?: number; limit?: number }) {
  const { data } = await httpClient.get<PagedResponse<AdminUser>>("/api/admin/users", { params });
  return data;
}

export async function updateAdminUser(id: string, payload: { role?: string; enabled?: boolean }) {
  const { data } = await httpClient.put<AdminUser>(`/api/admin/users/${id}`, payload);
  return data;
}

export async function adjustUserCredits(id: string, payload: { amount: number; reason?: string }) {
  await httpClient.post(`/api/admin/users/${id}/credits`, payload);
}

export async function listAdminJobs(params: { status?: string; page?: number; limit?: number }) {
  const { data } = await httpClient.get<PagedResponse<VideoJob>>("/api/admin/jobs", { params });
  return data;
}

export async function retryAdminJob(id: string) {
  const { data } = await httpClient.post<VideoJob>(`/api/admin/jobs/${id}/retry`);
  return data;
}

export async function listAdminSettings() {
  const { data } = await httpClient.get<AppSetting[]>("/api/admin/settings");
  return data;
}

export async function updateAdminSetting(payload: {
  key: string;
  value?: string | null;
  valueType?: string;
  category?: string;
}) {
  const { data } = await httpClient.put<AppSetting>("/api/admin/settings", payload);
  return data;
}

export async function listAdminNewsSources(params: { page?: number; limit?: number }) {
  const { data } = await httpClient.get<PagedResponse<NewsSource>>("/api/admin/news/sources", { params });
  return data;
}

export async function listAdminNewsItems(params: { page?: number; limit?: number }) {
  const { data } = await httpClient.get<PagedResponse<NewsItem>>("/api/admin/news/items", { params });
  return data;
}

export async function broadcastNotification(payload: { title: string; message?: string }) {
  const { data } = await httpClient.post<{ recipients: number }>("/api/admin/notifications/broadcast", payload);
  return data.recipients;
}
