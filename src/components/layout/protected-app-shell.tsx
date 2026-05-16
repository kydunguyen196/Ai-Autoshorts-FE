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
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7]">
        <div className="flex items-center gap-3 rounded-[18px] border border-[#e0e0e0] bg-white px-6 py-4 text-[17px] text-[#1d1d1f]">
          <Spinner className="h-4 w-4" />
          {t("shell.loadingWorkspace")}
        </div>
      </div>
    );
  }

  /* Session error */
  if (userBootstrapError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7] px-4">
        <div className="w-full max-w-md rounded-[18px] border border-[#e0e0e0] bg-white p-8">
          <h2 className="text-[21px] font-semibold tracking-[-0.374px] text-[#1d1d1f]">
            {t("shell.sessionExpired")}
          </h2>
          <p className="mt-2 text-[17px] tracking-[-0.374px] text-[#7a7a7a]">{userBootstrapError}</p>
          <div className="mt-6">
            <Button onClick={logout}>{t("shell.signInAgain")}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    /* Parchment canvas — Apple's default page background */
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="flex min-h-screen">
        <AppSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar onOpenMenu={() => setMobileOpen(true)} />

          {bootstrapQuery.isError ? (
            <div className="mx-5 mt-4 rounded-[11px] border border-[#ff9500]/40 bg-[#ff9500]/08 px-4 py-3 text-[14px] tracking-[-0.224px] text-[#7d4e00]">
              {t("shell.metadataFallback")}
            </div>
          ) : null}

          <main className="flex-1 px-5 py-8 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
