"use client";

import { Menu } from "lucide-react";

import { ChannelSelector } from "@/components/layout/channel-selector";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/use-auth";

export function AppTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { user, logout } = useAuth();

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
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-zinc-100">{user?.displayName ?? "User"}</p>
            <p className="text-xs text-zinc-400">{user?.email}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
