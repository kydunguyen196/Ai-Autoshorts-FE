"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  Bot,
  CreditCard,
  Link2,
  Megaphone,
  FolderKanban,
  Layers,
  LayoutDashboard,
  ListChecks,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { useI18n } from "@/features/i18n/language-context";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app",                        labelKey: "nav.overview",    icon: LayoutDashboard },
  { href: "/app/generate",               labelKey: "nav.generate",    icon: Sparkles },
  { href: "/app/jobs",                   labelKey: "nav.jobs",        icon: ListChecks },
  { href: "/app/topics",                 labelKey: "nav.topics",      icon: Layers },
  { href: "/app/batch",                  labelKey: "nav.batch",       icon: Bot },
  { href: "/app/channels",               labelKey: "nav.channels",    icon: FolderKanban },
  { href: "/app/characters/profiles",    labelKey: "nav.characters",  icon: UserRound },
  { href: "/app/characters/campaigns",   labelKey: "nav.campaigns",   icon: Megaphone },
  { href: "/app/integrations/tiktok",    labelKey: "nav.tiktok",      icon: Link2 },
  { href: "/app/billing",                labelKey: "nav.billing",     icon: CreditCard },
  { href: "/app/guide",                  labelKey: "nav.guide",       icon: BookOpenText },
];

export function AppSidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-[#11100e] bg-[#fffaf0] md:flex md:flex-col">
        <SidebarContent pathname={pathname} onNavigate={onClose} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            className="flex-1 bg-black/50"
            aria-label="Close menu"
            onClick={onClose}
          />
          <aside className="flex w-72 flex-col border-l border-[#11100e] bg-[#fffaf0]">
            <div className="flex justify-end p-4">
              <button
                className="rounded-full border border-[#11100e] p-2 text-[#11100e] hover:bg-[#c9ff4a]"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent pathname={pathname} onNavigate={onClose} />
          </aside>
        </div>
      ) : null}
    </>
  );
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
      <div className="mb-8 border-b border-[#11100e] px-2 pb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#686157]">
          {t("sidebar.appName")}
        </p>
        <h1 className="mt-3 text-[32px] font-semibold leading-[0.95] text-[#11100e]">
          {t("sidebar.title")}
        </h1>
        <p className="mt-3 text-[13px] leading-5 text-[#686157]">
          {t("sidebar.subtitle")}
        </p>
      </div>

      {/* Nav */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/app" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center justify-between gap-3 border border-transparent px-3 py-2.5",
                "text-[13px] transition-colors duration-100",
                active
                  ? "border-[#11100e] bg-[#c9ff4a] text-[#11100e]"
                  : "text-[#686157] hover:border-[#d8d0c1] hover:bg-[#f6f0e5] hover:text-[#11100e]",
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
