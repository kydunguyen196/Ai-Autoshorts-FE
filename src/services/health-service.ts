import { httpClient } from "@/services/http-client";
import type { HealthResponse } from "@/types/api";

export async function getHealth() {
  const { data } = await httpClient.get<HealthResponse>("/api/health");
  return data;
}
