"use client";

import { useQuery } from "@tanstack/react-query";

import { getFrontendBootstrap } from "@/services/bootstrap-service";
import { useAuth } from "@/features/auth/use-auth";

export function useBootstrapMetadata() {
  const { isAuthenticated, isHydrated } = useAuth();

  return useQuery({
    queryKey: ["frontend", "bootstrap"],
    queryFn: getFrontendBootstrap,
    enabled: isHydrated && isAuthenticated,
    staleTime: 5 * 60_000,
  });
}
