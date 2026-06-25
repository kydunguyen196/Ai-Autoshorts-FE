import axios, { type InternalAxiosRequestConfig } from "axios";

import {
  clearAuthToken,
  clearRefreshToken,
  getAuthToken,
  getRefreshToken,
  setAuthToken,
  setRefreshToken,
} from "@/lib/auth-storage";
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

// Single in-flight refresh shared across concurrent 401s, so a burst of failed requests
// triggers exactly one /api/auth/refresh call.
let refreshPromise: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }
  try {
    // Bare axios (not httpClient) to avoid the auth interceptors and recursion.
    const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
      `${env.apiBaseUrl}/api/auth/refresh`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } },
    );
    setAuthToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    return data.accessToken;
  } catch {
    clearAuthToken();
    clearRefreshToken();
    return null;
  }
}

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) {
    return false;
  }
  return (
    url.includes("/api/auth/login") ||
    url.includes("/api/auth/register") ||
    url.includes("/api/auth/refresh") ||
    url.includes("/api/auth/logout")
  );
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;

    if (status === 401 && original && !original._retry && !isAuthEndpoint(original.url)) {
      original._retry = true;

      if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;

      if (newToken) {
        original.headers.set("Authorization", `Bearer ${newToken}`);
        return httpClient(original);
      }
    }

    return Promise.reject(error);
  },
);
