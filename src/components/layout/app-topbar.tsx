"use client";

import { useQuery } from "@tanstack/react-query";
import { Menu } from "lucide-react";

import { ChannelSelector } from "@/components/layout/channel-selector";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/use-auth";
import { useI18n } from "@/features/i18n/language-context";
import { getBillingCredits } from "@/services/billing-service";

/**
 * Apple sub-nav-frosted: parchment 80% + backdrop blur, 52px height.
 * Persistent right-aligned primary CTA pattern.
 */
export function AppTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const creditsQuery = useQuery({
    queryKey: ["billing", "credits"],
    queryFn: getBillingCredits,
    staleTime: 30_000,
  });

  return (
    <header className="nav-frosted sticky top-0 z-20 border-b border-[#e0e0e0] px-5 py-0 h-[52px] flex items-center">
      <div className="flex w-full items-center justify-between gap-3">
        {/* Left: hamburger (mobile) + channel selector */}
        <div className="flex items-center gap-3">
          <button
            className="rounded-[8px] p-2 text-[#1d1d1f] hover:bg-black/05 md:hidden"
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
            <span className="hidden text-[14px] tracking-[-0.224px] text-[#7a7a7a] sm:block">
              {creditsQuery.data.creditsBalance} credits
            </span>
          ) : null}

          <LanguageSwitcher />

          <div className="hidden text-right sm:block">
            <p className="text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f]">
              {user?.displayName ?? t("topbar.userFallback")}
            </p>
            <p className="text-[12px] tracking-[-0.12px] text-[#7a7a7a]">{user?.email}</p>
          </div>

          <Button variant="ghost" size="sm" onClick={logout}>
            {t("topbar.logout")}
          </Button>
        </div>
      </div>
    </header>
  );
}
