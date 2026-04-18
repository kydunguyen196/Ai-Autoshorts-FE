"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  FolderKanban,
  Layers,
  LayoutDashboard,
  ListChecks,
  Sparkles,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/generate", label: "Generate", icon: Sparkles },
  { href: "/app/jobs", label: "Jobs", icon: ListChecks },
  { href: "/app/topics", label: "Topics", icon: Layers },
  { href: "/app/batch", label: "Batch", icon: Bot },
  { href: "/app/channels", label: "Channels", icon: FolderKanban },
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
  return (
    <>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">AutoShorts AI</p>
        <h1 className="mt-2 text-xl font-semibold text-zinc-100">Video Automation</h1>
        <p className="mt-1 text-sm text-zinc-400">AI workflows for creators</p>
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
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
