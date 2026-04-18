import { httpClient } from "@/services/http-client";
import type {
  PagedResponse,
  Topic,
  TopicCreateRequest,
  TopicImportRequest,
  TopicImportResponse,
  TopicStatus,
} from "@/types/api";

export interface TopicsFeedParams {
  page?: number;
  limit?: number;
  status?: TopicStatus;
}

export async function listRecentTopics(limit = 20, status?: TopicStatus) {
  const { data } = await httpClient.get<Topic[]>("/api/topics", {
    params: { limit, status },
  });
  return data;
}

export async function getTopicsFeed(params: TopicsFeedParams) {
  const { data } = await httpClient.get<PagedResponse<Topic>>("/api/topics/feed", {
    params,
  });
  return data;
}

export async function createTopic(payload: TopicCreateRequest) {
  const { data } = await httpClient.post<Topic>("/api/topics", payload);
  return data;
}

export async function importTopics(payload: TopicImportRequest) {
  const { data } = await httpClient.post<TopicImportResponse>("/api/topics/import", payload);
  return data;
}
