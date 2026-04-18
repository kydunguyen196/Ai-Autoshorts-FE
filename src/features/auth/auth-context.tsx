"use client";

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  clearActiveChannelId,
  clearAuthToken,
  getActiveChannelId,
  getAuthToken,
  setActiveChannelId as setActiveChannelIdStorage,
  setAuthToken as setAuthTokenStorage,
  storageChangeEventName,
} from "@/lib/auth-storage";
import { getCurrentUser, login as loginRequest, register as registerRequest } from "@/services/auth-service";
import type {
  AuthResponse,
  Channel,
  CurrentUserResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
} from "@/types/api";

type AuthContextValue = {
  token: string | null;
  user: UserProfile | null;
  defaultChannel: Channel | null;
  activeChannelId: string | null;
  setActiveChannelId: (channelId: string | null) => void;
  isHydrated: boolean;
  isAuthenticated: boolean;
  isBootstrappingUser: boolean;
  userBootstrapError: string | null;
  login: (payload: LoginRequest) => Promise<AuthResponse>;
  register: (payload: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  refetchCurrentUser: () => Promise<CurrentUserResponse | undefined>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function subscribeToStorage(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const storageHandler = () => callback();
  const customHandler = () => callback();

  window.addEventListener("storage", storageHandler);
  window.addEventListener(storageChangeEventName(), customHandler);

  return () => {
    window.removeEventListener("storage", storageHandler);
    window.removeEventListener(storageChangeEventName(), customHandler);
  };
}

function subscribeNoop() {
  return () => {};
}

function getAuthErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Unable to load current user";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const isHydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const token = useSyncExternalStore(subscribeToStorage, getAuthToken, () => null);
  const storedActiveChannelId = useSyncExternalStore(subscribeToStorage, getActiveChannelId, () => null);

  const currentUserQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: isHydrated && !!token,
    staleTime: 60_000,
    retry: false,
  });

  const applyAuth = useCallback(
    (response: AuthResponse) => {
      setAuthTokenStorage(response.accessToken);

      const defaultChannelId = response.defaultChannel?.id ?? null;
      if (defaultChannelId) {
        setActiveChannelIdStorage(defaultChannelId);
      }

      queryClient.setQueryData(["auth", "me"], {
        user: response.user,
        defaultChannel: response.defaultChannel,
      } satisfies CurrentUserResponse);
    },
    [queryClient],
  );

  const login = useCallback(
    async (payload: LoginRequest) => {
      const response = await loginRequest(payload);
      applyAuth(response);
      return response;
    },
    [applyAuth],
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const response = await registerRequest(payload);
      applyAuth(response);
      return response;
    },
    [applyAuth],
  );

  const logout = useCallback(() => {
    clearAuthToken();
    clearActiveChannelId();
    queryClient.removeQueries({ queryKey: ["auth"] });
  }, [queryClient]);

  const setActiveChannelId = useCallback((channelId: string | null) => {
    if (channelId) {
      setActiveChannelIdStorage(channelId);
      return;
    }
    clearActiveChannelId();
  }, []);

  const value: AuthContextValue = {
    token,
    user: currentUserQuery.data?.user ?? null,
    defaultChannel: currentUserQuery.data?.defaultChannel ?? null,
    activeChannelId: storedActiveChannelId ?? currentUserQuery.data?.defaultChannel?.id ?? null,
    setActiveChannelId,
    isHydrated,
    isAuthenticated: Boolean(token),
    isBootstrappingUser: Boolean(token) && currentUserQuery.isLoading,
    userBootstrapError: currentUserQuery.isError
      ? getAuthErrorMessage(currentUserQuery.error)
      : null,
    login,
    register,
    logout,
    refetchCurrentUser: async () => {
      const result = await currentUserQuery.refetch();
      return result.data;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

