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
      {/* Desktop sidebar — Apple near-black tile */}
      <aside className="hidden w-64 shrink-0 bg-[#1d1d1f] md:flex md:flex-col">
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
          <aside className="w-64 bg-[#1d1d1f] flex flex-col">
            <div className="flex justify-end p-4">
              <button
                className="rounded-[8px] p-2 text-[#cccccc] hover:bg-white/10"
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
    <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6">
      {/* Brand */}
      <div className="mb-8 px-2">
        <p className="text-[12px] font-normal tracking-[-0.12px] text-[#cccccc]">
          {t("sidebar.appName")}
        </p>
        <h1 className="mt-1 text-[21px] font-semibold tracking-[0.231px] text-white">
          {t("sidebar.title")}
        </h1>
        <p className="mt-0.5 text-[14px] tracking-[-0.224px] text-[#7a7a7a]">
          {t("sidebar.subtitle")}
        </p>
      </div>

      {/* Nav */}
      <nav className="space-y-0.5">
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
                "flex items-center gap-3 rounded-[8px] px-3 py-2.5",
                "text-[14px] tracking-[-0.224px] transition-colors duration-100",
                active
                  ? "bg-white/15 text-white"
                  : "text-[#cccccc] hover:bg-white/08 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
