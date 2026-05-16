"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/use-auth";
import { useI18n } from "@/features/i18n/language-context";
import { useBootstrapMetadata } from "@/hooks/use-bootstrap";

export function ProtectedAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isHydrated, isAuthenticated, isBootstrappingUser, userBootstrapError, logout } = useAuth();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const bootstrapQuery = useBootstrapMetadata();

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      const next = encodeURIComponent(pathname || "/app");
      router.replace(`/login?next=${next}`);
    }
  }, [isHydrated, isAuthenticated, pathname, router]);

  /* Loading state */
  if (!isHydrated || (!isAuthenticated && isHydrated) || isBootstrappingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f0e5]">
        <div className="studio-card flex items-center gap-3 px-6 py-4 text-[16px] text-[#11100e]">
          <Spinner className="h-4 w-4" />
          {t("shell.loadingWorkspace")}
        </div>
      </div>
    );
  }

  /* Session error */
  if (userBootstrapError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f0e5] px-4">
        <div className="studio-card w-full max-w-md p-8">
          <h2 className="text-[28px] font-semibold leading-tight text-[#11100e]">
            {t("shell.sessionExpired")}
          </h2>
          <p className="mt-2 text-[16px] text-[#686157]">{userBootstrapError}</p>
          <div className="mt-6">
            <Button onClick={logout}>{t("shell.signInAgain")}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f0e5] text-[#11100e]">
      <div className="flex min-h-screen">
        <AppSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar onOpenMenu={() => setMobileOpen(true)} />

          {bootstrapQuery.isError ? (
            <div className="mx-5 mt-4 border border-[#8a5a00]/30 bg-[#c9ff4a]/20 px-4 py-3 font-mono text-[12px] uppercase tracking-[0.12em] text-[#5d4100]">
              {t("shell.metadataFallback")}
            </div>
          ) : null}

          <main className="flex-1 px-5 py-8 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
