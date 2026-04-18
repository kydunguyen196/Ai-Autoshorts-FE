import { httpClient } from "@/services/http-client";
import type { FrontendBootstrapResponse } from "@/types/api";

export async function getFrontendBootstrap() {
  const { data } = await httpClient.get<FrontendBootstrapResponse>("/api/frontend/bootstrap");
  return data;
}
