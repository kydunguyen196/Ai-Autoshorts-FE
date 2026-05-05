"use client";

import { useQuery } from "@tanstack/react-query";
import { Menu } from "lucide-react";

import { ChannelSelector } from "@/components/layout/channel-selector";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/use-auth";
import { useI18n } from "@/features/i18n/language-context";
import { getBillingCredits } from "@/services/billing-service";

export function AppTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const creditsQuery = useQuery({
    queryKey: ["billing", "credits"],
    queryFn: getBillingCredits,
    staleTime: 30_000,
  });

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/70 bg-zinc-950/80 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 md:hidden"
            onClick={onOpenMenu}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <ChannelSelector />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200 sm:block">
            {creditsQuery.data?.creditsBalance ?? "-"} credits
          </div>
          <LanguageSwitcher />
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-zinc-100">{user?.displayName ?? t("topbar.userFallback")}</p>
            <p className="text-xs text-zinc-400">{user?.email}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={logout}>
            {t("topbar.logout")}
          </Button>
        </div>
      </div>
    </header>
  );
}
