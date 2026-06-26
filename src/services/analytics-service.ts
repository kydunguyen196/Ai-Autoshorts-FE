import { httpClient } from "@/services/http-client";
import type { AnalyticsSummaryResponse } from "@/types/api";

export async function getAnalyticsSummary(windowDays = 30) {
  const { data } = await httpClient.get<AnalyticsSummaryResponse>("/api/analytics/summary", {
    params: { windowDays },
  });
  return data;
}
