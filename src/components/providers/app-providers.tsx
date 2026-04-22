"use client";

import { useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/features/auth/auth-context";
import { LanguageProvider } from "@/features/i18n/language-context";
import { createQueryClient } from "@/lib/query-client";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>{children}</AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
