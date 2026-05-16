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
    <header className="nav-frosted sticky top-0 z-20 flex h-[60px] items-center border-b border-[#11100e] px-5 py-0">
      <div className="flex w-full items-center justify-between gap-3">
        {/* Left: hamburger (mobile) + channel selector */}
        <div className="flex items-center gap-3">
          <button
            className="rounded-full border border-[#11100e] p-2 text-[#11100e] hover:bg-[#c9ff4a] md:hidden"
            onClick={onOpenMenu}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <ChannelSelector />
        </div>

        {/* Right: credits + language + user + logout */}
        <div className="flex items-center gap-4">
          {creditsQuery.data ? (
            <span className="hidden font-mono text-[12px] uppercase tracking-[0.16em] text-[#686157] sm:block">
              {creditsQuery.data.creditsBalance} credits
            </span>
          ) : null}

          <LanguageSwitcher />

          <div className="hidden text-right sm:block">
            <p className="text-[14px] font-semibold text-[#11100e]">
              {user?.displayName ?? t("topbar.userFallback")}
            </p>
            <p className="text-[12px] text-[#686157]">{user?.email}</p>
          </div>

          <Button variant="ghost" size="sm" onClick={logout}>
            {t("topbar.logout")}
          </Button>
        </div>
      </div>
    </header>
  );
}
