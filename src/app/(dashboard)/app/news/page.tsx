"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/use-auth";
import { useI18n } from "@/features/i18n/language-context";
import { useToast } from "@/features/toast/toast-context";
import { useBootstrapMetadata } from "@/hooks/use-bootstrap";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import {
  createNewsSource,
  deleteNewsSource,
  fetchNewsSourceNow,
  getNewsItems,
  listNewsSources,
  updateNewsSource,
} from "@/services/news-service";
import type { NewsSource, NewsSourceRequest } from "@/types/api";

const EMPTY_FORM: NewsSourceRequest = {
  name: "",
  feedUrl: "",
  enabled: true,
  autoPublish: false,
  fetchIntervalMinutes: 60,
  maxItemsPerFetch: 5,
  contentStyle: "",
};

export default function NewsPage() {
  const { t } = useI18n();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { activeChannelId } = useAuth();
  const bootstrapQuery = useBootstrapMetadata();
  const styles = bootstrapQuery.data?.supportedStyles ?? [
    "motivation",
    "storytelling",
    "facts",
    "self-improvement",
  ];

  const [form, setForm] = useState<NewsSourceRequest>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemsPage, setItemsPage] = useState(0);
  const [itemsSource, setItemsSource] = useState<string>("");

  const sourcesQuery = useQuery({
    queryKey: ["news", "sources"],
    queryFn: listNewsSources,
  });

  const itemsQuery = useQuery({
    queryKey: ["news", "items", itemsPage, itemsSource],
    queryFn: () =>
      getNewsItems({ page: itemsPage, limit: 20, sourceId: itemsSource || undefined }),
    refetchInterval: 30_000,
  });

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const saveMutation = useMutation({
    mutationFn: (payload: NewsSourceRequest) => {
      const body = { ...payload, channelId: activeChannelId || undefined };
      return editingId ? updateNewsSource(editingId, body) : createNewsSource(body);
    },
    onSuccess: () => {
      toast.success(t("news.saved", "News source saved"));
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["news", "sources"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNewsSource(id),
    onSuccess: () => {
      toast.success(t("news.deleted", "News source deleted"));
      queryClient.invalidateQueries({ queryKey: ["news", "sources"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const fetchNowMutation = useMutation({
    mutationFn: (id: string) => fetchNewsSourceNow(id),
    onSuccess: (newItems) => {
      toast.success(t("news.fetched", "Fetched {n} new items").replace("{n}", String(newItems)));
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const startEdit = (source: NewsSource) => {
    setEditingId(source.id);
    setForm({
      name: source.name,
      feedUrl: source.feedUrl,
      enabled: source.enabled,
      autoPublish: source.autoPublish,
      fetchIntervalMinutes: source.fetchIntervalMinutes,
      maxItemsPerFetch: source.maxItemsPerFetch,
      contentStyle: source.contentStyle ?? "",
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <PageHeader
        title={t("news.title", "News Automation")}
        description={t(
          "news.description",
          "Pull articles from RSS feeds and turn them into short videos automatically.",
        )}
      />

      <section className="grid gap-4 xl:grid-cols-[2fr_3fr]">
        <Card>
          <h2 className="text-lg font-semibold text-foreground">
            {editingId ? t("news.editSource", "Edit source") : t("news.addSource", "Add RSS source")}
          </h2>
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              saveMutation.mutate(form);
            }}
          >
            <label className="block space-y-2">
              <span className="text-sm text-strong">{t("news.name", "Name")}</span>
              <Input
                value={form.name}
                onChange={(event) => setForm((f) => ({ ...f, name: event.target.value }))}
                placeholder="VnExpress - Tin nóng"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-strong">{t("news.feedUrl", "Feed URL")}</span>
              <Input
                type="url"
                value={form.feedUrl}
                onChange={(event) => setForm((f) => ({ ...f, feedUrl: event.target.value }))}
                placeholder="https://vnexpress.net/rss/tin-moi-nhat.rss"
                required
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm text-strong">{t("news.style", "Content style")}</span>
                <Select
                  value={form.contentStyle ?? ""}
                  onChange={(event) => setForm((f) => ({ ...f, contentStyle: event.target.value }))}
                >
                  <option value="">{t("news.styleAuto", "Auto/default")}</option>
                  {styles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-strong">{t("news.interval", "Interval (minutes)")}</span>
                <Input
                  type="number"
                  min={5}
                  value={form.fetchIntervalMinutes}
                  onChange={(event) =>
                    setForm((f) => ({ ...f, fetchIntervalMinutes: Number(event.target.value) }))
                  }
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-strong">{t("news.maxItems", "Max items / fetch")}</span>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={form.maxItemsPerFetch}
                  onChange={(event) =>
                    setForm((f) => ({ ...f, maxItemsPerFetch: Number(event.target.value) }))
                  }
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-5 pt-1">
              <label className="flex items-center gap-2 text-sm text-strong">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(event) => setForm((f) => ({ ...f, enabled: event.target.checked }))}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                {t("news.enabled", "Enabled")}
              </label>
              <label className="flex items-center gap-2 text-sm text-strong">
                <input
                  type="checkbox"
                  checked={form.autoPublish}
                  onChange={(event) => setForm((f) => ({ ...f, autoPublish: event.target.checked }))}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                {t("news.autoPublish", "Auto-publish")}
              </label>
            </div>

            <div className="flex gap-2 pt-1">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner /> {t("common.saving", "Saving…")}
                  </span>
                ) : editingId ? (
                  t("common.save", "Save")
                ) : (
                  t("news.addSource", "Add RSS source")
                )}
              </Button>
              {editingId ? (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  {t("common.cancel", "Cancel")}
                </Button>
              ) : null}
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-foreground">{t("news.sources", "RSS sources")}</h2>
          {sourcesQuery.isLoading ? (
            <p className="mt-4 text-sm text-muted">{t("common.loading", "Loading…")}</p>
          ) : sourcesQuery.data && sourcesQuery.data.length > 0 ? (
            <div className="mt-4 space-y-3">
              {sourcesQuery.data.map((source) => (
                <div
                  key={source.id}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold text-foreground">{source.name}</p>
                      <p className="truncate text-[12px] text-muted">{source.feedUrl}</p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <Badge intent={source.enabled ? "success" : "neutral"}>
                        {source.enabled ? "ON" : "OFF"}
                      </Badge>
                      {source.autoPublish ? <Badge intent="accent">AUTO</Badge> : null}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted">
                    <span>{source.fetchIntervalMinutes}m</span>
                    <span>{source.maxItemsPerFetch} {t("news.itemsShort", "items")}</span>
                    {source.contentStyle ? <span>{source.contentStyle}</span> : null}
                    {source.lastStatus ? (
                      <span className={source.lastStatus === "OK" ? "text-success" : "text-danger"}>
                        {source.lastStatus}
                      </span>
                    ) : null}
                    {source.lastFetchedAt ? <span>{formatDateTime(source.lastFetchedAt)}</span> : null}
                  </div>
                  {source.lastError ? (
                    <p className="mt-1 line-clamp-2 text-[12px] text-danger">{source.lastError}</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => fetchNowMutation.mutate(source.id)}
                      disabled={fetchNowMutation.isPending}
                    >
                      {t("news.fetchNow", "Fetch now")}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(source)}>
                      {t("common.edit", "Edit")}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (window.confirm(t("news.deleteConfirm", "Delete this source?"))) {
                          deleteMutation.mutate(source.id);
                        }
                      }}
                    >
                      {t("common.delete", "Delete")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("news.noSources", "No RSS sources yet")}
              description={t("news.noSourcesDesc", "Add an RSS feed to start automatic ingestion.")}
            />
          )}
        </Card>
      </section>

      <section className="mt-6">
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">{t("news.items", "Ingested items")}</h2>
            <div className="flex items-center gap-2">
              <Select
                value={itemsSource}
                onChange={(event) => {
                  setItemsSource(event.target.value);
                  setItemsPage(0);
                }}
              >
                <option value="">{t("news.allSources", "All sources")}</option>
                {(sourcesQuery.data ?? []).map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </Select>
              <Button variant="secondary" size="sm" onClick={() => itemsQuery.refetch()}>
                {t("common.refresh", "Refresh")}
              </Button>
            </div>
          </div>

          {itemsQuery.isLoading ? (
            <p className="text-sm text-muted">{t("common.loading", "Loading…")}</p>
          ) : itemsQuery.data && itemsQuery.data.items.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-subtle text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t("news.colTitle", "Title")}</th>
                    <th className="px-4 py-3 font-medium">{t("news.colStatus", "Status")}</th>
                    <th className="px-4 py-3 font-medium">{t("news.colPublished", "Published")}</th>
                    <th className="px-4 py-3 font-medium">{t("news.colIngested", "Ingested")}</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsQuery.data.items.map((item) => (
                    <tr key={item.id} className="border-t border-border">
                      <td className="max-w-md px-4 py-3 text-foreground">
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-accent"
                          >
                            {item.title}
                          </a>
                        ) : (
                          item.title
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge intent={statusIntent(item.status)}>{item.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted">{formatDateTime(item.publishedAt)}</td>
                      <td className="px-4 py-3 text-muted">{formatDateTime(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title={t("news.noItems", "No items yet")}
              description={t("news.noItemsDesc", "Fetch a source to ingest its latest articles.")}
            />
          )}

          {itemsQuery.data ? (
            <PaginationControls
              page={itemsQuery.data.page}
              totalPages={itemsQuery.data.totalPages}
              hasPrevious={itemsQuery.data.hasPrevious}
              hasNext={itemsQuery.data.hasNext}
              onChange={(nextPage) => setItemsPage(Math.max(nextPage, 0))}
            />
          ) : null}
        </Card>
      </section>
    </div>
  );
}

function statusIntent(status: string): "neutral" | "success" | "warning" | "danger" | "info" {
  switch (status) {
    case "CONVERTED":
      return "success";
    case "FAILED":
      return "danger";
    case "SKIPPED":
      return "warning";
    default:
      return "info";
  }
}
