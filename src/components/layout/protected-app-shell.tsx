"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/use-auth";
import { useBootstrapMetadata } from "@/hooks/use-bootstrap";

export function ProtectedAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isHydrated, isAuthenticated, isBootstrappingUser, userBootstrapError, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const bootstrapQuery = useBootstrapMetadata();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      const next = encodeURIComponent(pathname || "/app");
      router.replace(`/login?next=${next}`);
    }
  }, [isHydrated, isAuthenticated, pathname, router]);

  if (!isHydrated || (!isAuthenticated && isHydrated) || isBootstrappingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-300">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4">
          <Spinner className="h-4 w-4" />
          Loading your workspace...
        </div>
      </div>
    );
  }

  if (userBootstrapError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <Card className="max-w-lg">
          <h2 className="text-lg font-semibold text-zinc-100">Session expired</h2>
          <p className="mt-2 text-sm text-zinc-400">{userBootstrapError}</p>
          <div className="mt-6 flex gap-3">
            <Button onClick={logout}>Sign in again</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(99,102,241,0.22),transparent),radial-gradient(1000px_500px_at_90%_0%,rgba(56,189,248,0.16),transparent),#09090b] text-zinc-100">
      <div className="flex min-h-screen">
        <AppSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar onOpenMenu={() => setMobileOpen(true)} />

          {bootstrapQuery.isError ? (
            <div className="mx-4 mt-4 rounded-xl border border-amber-700/50 bg-amber-500/10 p-3 text-sm text-amber-200 md:mx-6">
              Could not load frontend metadata. Forms may fallback to manual values.
            </div>
          ) : null}

          <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
