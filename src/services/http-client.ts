import axios from "axios";

import { getAuthToken } from "@/lib/auth-storage";
import { env } from "@/lib/env";

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getAuthorizationHeader(token?: string | null) {
  if (!token) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
}

httpClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});
