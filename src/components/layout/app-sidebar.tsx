"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  Bot,
  Clapperboard,
  CreditCard,
  Link2,
  Megaphone,
  FolderKanban,
  Gauge,
  Layers,
  LayoutDashboard,
  ListChecks,
  Newspaper,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "@/features/auth/use-auth";
import { useI18n } from "@/features/i18n/language-context";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app",                        labelKey: "nav.overview",    icon: LayoutDashboard },
  { href: "/app/generate",               labelKey: "nav.generate",    icon: Sparkles },
  { href: "/app/jobs",                   labelKey: "nav.jobs",        icon: ListChecks },
  { href: "/app/topics",                 labelKey: "nav.topics",      icon: Layers },
  { href: "/app/news",                   labelKey: "nav.news",        icon: Newspaper },
  { href: "/app/batch",                  labelKey: "nav.batch",       icon: Bot },
  { href: "/app/channels",               labelKey: "nav.channels",    icon: FolderKanban },
  { href: "/app/characters/profiles",    labelKey: "nav.characters",  icon: UserRound },
  { href: "/app/characters/campaigns",   labelKey: "nav.campaigns",   icon: Megaphone },
  { href: "/app/integrations/tiktok",    labelKey: "nav.tiktok",      icon: Link2 },
  { href: "/app/billing",                labelKey: "nav.billing",     icon: CreditCard },
  { href: "/app/guide",                  labelKey: "nav.guide",       icon: BookOpenText },
];

const adminNavItems = [
  { href: "/app/admin",          labelKey: "nav.admin.overview", icon: Gauge },
  { href: "/app/admin/users",    labelKey: "nav.admin.users",    icon: Users },
  { href: "/app/admin/jobs",     labelKey: "nav.admin.jobs",     icon: ListChecks },
  { href: "/app/admin/news",     labelKey: "nav.admin.news",     icon: Newspaper },
  { href: "/app/admin/settings", labelKey: "nav.admin.settings", icon: Settings },
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
      <aside className="glass hidden w-72 shrink-0 border-r border-border md:flex md:flex-col">
        <SidebarContent pathname={pathname} onNavigate={onClose} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            className="flex-1 bg-black/60 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={onClose}
          />
          <aside className="glass flex w-72 flex-col border-l border-border float-shadow">
            <div className="flex justify-end p-4">
              <button
                className="rounded-full border border-border p-2 text-foreground transition-colors hover:border-accent hover:text-accent"
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

type NavItem = { href: string; labelKey: string; icon: typeof LayoutDashboard };

// Non-index links (anything but "/app" and "/app/admin") highlight on prefix too.
const EXACT_MATCH_HREFS = new Set(["/app", "/app/admin"]);

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const { t } = useI18n();
  const Icon = item.icon;
  const active =
    pathname === item.href ||
    (!EXACT_MATCH_HREFS.has(item.href) && pathname.startsWith(`${item.href}/`));

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5",
        "text-[13.5px] transition-all duration-200",
        active
          ? "border-border bg-surface text-foreground soft-shadow"
          : "text-muted hover:border-border hover:bg-surface/60 hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-accent transition-opacity duration-200",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          active ? "text-accent" : "text-faint group-hover:text-foreground",
        )}
      />
      <span className="min-w-0 truncate">{t(item.labelKey)}</span>
    </Link>
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
  const { isAdmin } = useAuth();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
      <div className="mb-7 border-b border-border px-2 pb-6">
        <Link href="/app" onClick={onNavigate} className="group inline-flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-accent text-on-accent glow-accent transition-transform group-hover:scale-105">
            <Clapperboard className="h-4 w-4" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
            {t("sidebar.appName")}
          </span>
        </Link>
        <h1 className="mt-4 text-[28px] font-semibold leading-[1.0] tracking-tight text-foreground">
          {t("sidebar.title")}
        </h1>
        <p className="mt-2.5 text-[13px] leading-5 text-muted">{t("sidebar.subtitle")}</p>
      </div>

      {/* Nav */}
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </nav>

      {isAdmin ? (
        <nav className="mt-6 space-y-1 border-t border-border pt-5">
          <p className="mb-2 flex items-center gap-2 px-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-faint">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("nav.admin.section", "Admin")}
          </p>
          {adminNavItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
          ))}
        </nav>
      ) : null}
    </div>
  );
}
