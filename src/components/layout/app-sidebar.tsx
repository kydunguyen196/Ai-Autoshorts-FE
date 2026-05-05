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
  { href: "/app", labelKey: "nav.overview", icon: LayoutDashboard },
  { href: "/app/generate", labelKey: "nav.generate", icon: Sparkles },
  { href: "/app/jobs", labelKey: "nav.jobs", icon: ListChecks },
  { href: "/app/topics", labelKey: "nav.topics", icon: Layers },
  { href: "/app/batch", labelKey: "nav.batch", icon: Bot },
  { href: "/app/channels", labelKey: "nav.channels", icon: FolderKanban },
  { href: "/app/characters/profiles", labelKey: "nav.characters", icon: UserRound },
  { href: "/app/characters/campaigns", labelKey: "nav.campaigns", icon: Megaphone },
  { href: "/app/integrations/tiktok", labelKey: "nav.tiktok", icon: Link2 },
  { href: "/app/billing", labelKey: "nav.billing", icon: CreditCard },
  { href: "/app/guide", labelKey: "nav.guide", icon: BookOpenText },
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
      <aside className="hidden w-72 shrink-0 border-r border-zinc-800/70 bg-zinc-950/90 p-6 md:block">
        <SidebarContent pathname={pathname} onNavigate={onClose} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            className="w-full bg-black/60"
            aria-label="Close menu"
            onClick={onClose}
          />
          <aside className="w-72 border-l border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-4 flex justify-end">
              <button
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800"
                onClick={onClose}
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
    <>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t("sidebar.appName")}</p>
        <h1 className="mt-2 text-xl font-semibold text-zinc-100">{t("sidebar.title")}</h1>
        <p className="mt-1 text-sm text-zinc-400">{t("sidebar.subtitle")}</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "border border-indigo-500/50 bg-indigo-500/15 text-indigo-100"
                  : "text-zinc-300 hover:bg-zinc-800/80",
              )}
            >
              <Icon className="h-4 w-4" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
