import { httpClient } from "@/services/http-client";
import type { NotificationItem, PagedResponse } from "@/types/api";

export interface NotificationsFeedParams {
  page?: number;
  limit?: number;
  unread?: boolean;
}

export async function getNotificationsFeed(params: NotificationsFeedParams) {
  const { data } = await httpClient.get<PagedResponse<NotificationItem>>("/api/notifications", {
    params,
  });
  return data;
}

export async function getUnreadCount() {
  const { data } = await httpClient.get<{ count: number }>("/api/notifications/unread-count");
  return data.count;
}

export async function markNotificationRead(id: string) {
  await httpClient.post(`/api/notifications/${id}/read`);
}

export async function markAllNotificationsRead() {
  const { data } = await httpClient.post<{ updated: number }>("/api/notifications/read-all");
  return data.updated;
}
