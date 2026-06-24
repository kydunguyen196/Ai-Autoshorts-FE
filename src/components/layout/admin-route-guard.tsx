"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/use-auth";
import { useI18n } from "@/features/i18n/language-context";

/**
 * Restricts a subtree to ADMIN users. Assumes it is rendered inside ProtectedAppShell,
 * so the user is already authenticated and bootstrapped by the time this runs.
 */
export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isHydrated, isBootstrappingUser, isAdmin } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    if (!isHydrated || isBootstrappingUser) return;
    if (!isAdmin) {
      router.replace("/app");
    }
  }, [isHydrated, isBootstrappingUser, isAdmin, router]);

  if (!isHydrated || isBootstrappingUser || !isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="studio-card flex items-center gap-3 px-6 py-4 text-[16px] text-foreground">
          <Spinner className="h-4 w-4 text-accent" />
          {t("admin.checkingAccess", "Đang kiểm tra quyền truy cập…")}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
