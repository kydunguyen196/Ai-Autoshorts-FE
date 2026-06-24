import { httpClient } from "@/services/http-client";
import type { NewsItem, NewsSource, NewsSourceRequest, PagedResponse } from "@/types/api";

export async function listNewsSources() {
  const { data } = await httpClient.get<NewsSource[]>("/api/news/sources");
  return data;
}

export async function createNewsSource(payload: NewsSourceRequest) {
  const { data } = await httpClient.post<NewsSource>("/api/news/sources", payload);
  return data;
}

export async function updateNewsSource(id: string, payload: NewsSourceRequest) {
  const { data } = await httpClient.put<NewsSource>(`/api/news/sources/${id}`, payload);
  return data;
}

export async function deleteNewsSource(id: string) {
  await httpClient.delete(`/api/news/sources/${id}`);
}

export async function fetchNewsSourceNow(id: string) {
  const { data } = await httpClient.post<{ newItems: number }>(`/api/news/sources/${id}/fetch-now`);
  return data.newItems;
}

export async function getNewsItems(params: { sourceId?: string; page?: number; limit?: number }) {
  const { data } = await httpClient.get<PagedResponse<NewsItem>>("/api/news/items", { params });
  return data;
}
