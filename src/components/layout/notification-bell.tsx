"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";

import { useI18n } from "@/features/i18n/language-context";
import { useNotificationStream } from "@/hooks/use-notification-stream";
import { cn, formatDateTime } from "@/lib/utils";
import {
  getNotificationsFeed,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notifications-service";

export function NotificationBell() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useNotificationStream(true);

  const unreadQuery = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    refetchInterval: 30_000,
  });

  const feedQuery = useQuery({
    queryKey: ["notifications", "feed"],
    queryFn: () => getNotificationsFeed({ page: 0, limit: 15 }),
    enabled: open,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const unread = unreadQuery.data ?? 0;
  const items = feedQuery.data?.items ?? [];

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        aria-label={t("notifications.title", "Notifications")}
        className="relative rounded-full border border-border p-2 text-foreground transition-colors hover:border-accent hover:text-accent"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-on-accent">
            {unread > 99 ? "99+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="glass float-shadow absolute right-0 z-50 mt-2 w-80 max-w-[90vw] rounded-2xl border border-border p-2">
          <div className="flex items-center justify-between px-2 py-2">
            <p className="text-[14px] font-semibold text-foreground">
              {t("notifications.title", "Notifications")}
            </p>
            <button
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending || unread === 0}
              className="inline-flex items-center gap-1 text-[12px] text-muted transition-colors hover:text-accent disabled:opacity-40"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              {t("notifications.markAll", "Mark all read")}
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {feedQuery.isLoading ? (
              <p className="px-3 py-6 text-center text-[13px] text-muted">
                {t("common.loading", "Loading…")}
              </p>
            ) : items.length === 0 ? (
              <p className="px-3 py-6 text-center text-[13px] text-muted">
                {t("notifications.empty", "No notifications yet")}
              </p>
            ) : (
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        if (!item.read) markReadMutation.mutate(item.id);
                      }}
                      className={cn(
                        "w-full rounded-xl border px-3 py-2.5 text-left transition-colors",
                        item.read
                          ? "border-transparent hover:bg-surface/60"
                          : "border-accent/30 bg-accent/5 hover:bg-accent/10",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {!item.read ? (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                        ) : (
                          <span className="mt-1.5 h-2 w-2 shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-medium text-foreground">
                            {item.title}
                          </p>
                          {item.message ? (
                            <p className="mt-0.5 line-clamp-2 text-[12.5px] text-muted">
                              {item.message}
                            </p>
                          ) : null}
                          <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
                            {formatDateTime(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
