"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/features/i18n/language-context";
import { useToast } from "@/features/toast/toast-context";
import { getErrorMessage } from "@/lib/utils";
import {
  broadcastNotification,
  listAdminSettings,
  updateAdminSetting,
} from "@/services/admin-service";
import type { AppSetting } from "@/types/api";

export default function AdminSettingsPage() {
  const { t } = useI18n();
  const toast = useToast();
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: listAdminSettings,
  });

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [syncedData, setSyncedData] = useState<typeof settingsQuery.data>(undefined);

  // Seed editable drafts from server data whenever a fresh fetch arrives
  // (render-time adjustment pattern — avoids an effect that loops on setState).
  if (settingsQuery.data && settingsQuery.data !== syncedData) {
    const next: Record<string, string> = {};
    for (const setting of settingsQuery.data) {
      next[setting.key] = setting.value ?? "";
    }
    setSyncedData(settingsQuery.data);
    setDrafts(next);
  }

  const updateMutation = useMutation({
    mutationFn: (setting: AppSetting) =>
      updateAdminSetting({
        key: setting.key,
        value: drafts[setting.key] ?? "",
        valueType: setting.valueType,
        category: setting.category,
      }),
    onSuccess: () => {
      toast.success(t("admin.settings.saved", "Setting saved"));
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const grouped = useMemo(() => {
    const map = new Map<string, AppSetting[]>();
    for (const setting of settingsQuery.data ?? []) {
      const list = map.get(setting.category) ?? [];
      list.push(setting);
      map.set(setting.category, list);
    }
    return Array.from(map.entries());
  }, [settingsQuery.data]);

  const isBoolean = (s: AppSetting) => s.valueType?.toUpperCase() === "BOOLEAN";

  return (
    <div>
      <PageHeader
        title={t("admin.settings.title", "Runtime Settings")}
        description={t(
          "admin.settings.description",
          "Change behaviour without restarting. DB values override YAML/env defaults.",
        )}
      />

      <BroadcastCard />

      {settingsQuery.isLoading ? (
        <p className="text-sm text-muted">{t("common.loading", "Loading…")}</p>
      ) : grouped.length === 0 ? (
        <EmptyState
          title={t("admin.settings.empty", "No settings yet")}
          description={t(
            "admin.settings.emptyDesc",
            "Settings appear here once they are written to the database.",
          )}
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(([category, settings]) => (
            <Card key={category}>
              <h2 className="text-lg font-semibold capitalize text-foreground">{category}</h2>
              <div className="mt-4 space-y-4">
                {settings.map((setting) => (
                  <div
                    key={setting.key}
                    className="flex flex-col gap-2 border-b border-border pb-4 last:border-0 last:pb-0 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0 md:max-w-md">
                      <p className="font-mono text-[13px] text-foreground">{setting.key}</p>
                      {setting.description ? (
                        <p className="text-[12px] text-muted">{setting.description}</p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      {isBoolean(setting) ? (
                        <label className="flex items-center gap-2 text-sm text-strong">
                          <input
                            type="checkbox"
                            checked={(drafts[setting.key] ?? "").toLowerCase() === "true"}
                            onChange={(event) =>
                              setDrafts((d) => ({
                                ...d,
                                [setting.key]: event.target.checked ? "true" : "false",
                              }))
                            }
                            className="h-4 w-4 accent-[var(--accent)]"
                          />
                          {(drafts[setting.key] ?? "").toLowerCase() === "true"
                            ? t("common.on", "On")
                            : t("common.off", "Off")}
                        </label>
                      ) : (
                        <Input
                          value={drafts[setting.key] ?? ""}
                          onChange={(event) =>
                            setDrafts((d) => ({ ...d, [setting.key]: event.target.value }))
                          }
                          className="w-48"
                        />
                      )}
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate(setting)}
                      >
                        {t("common.save", "Save")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function BroadcastCard() {
  const { t } = useI18n();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const broadcastMutation = useMutation({
    mutationFn: () => broadcastNotification({ title, message: message || undefined }),
    onSuccess: (recipients) => {
      toast.success(
        t("admin.broadcast.sent", "Sent to {n} users").replace("{n}", String(recipients)),
      );
      setTitle("");
      setMessage("");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <Card className="mb-6">
      <h2 className="text-lg font-semibold text-foreground">
        {t("admin.broadcast.title", "Broadcast notification")}
      </h2>
      <p className="mt-1 text-sm text-muted">
        {t("admin.broadcast.description", "Send an in-app notification to every user.")}
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim()) return;
          broadcastMutation.mutate();
        }}
      >
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t("admin.broadcast.titlePlaceholder", "Title")}
          required
        />
        <Textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={t("admin.broadcast.messagePlaceholder", "Message (optional)")}
          className="min-h-24"
        />
        <Button type="submit" disabled={broadcastMutation.isPending || !title.trim()}>
          {t("admin.broadcast.send", "Send broadcast")}
        </Button>
      </form>
    </Card>
  );
}
