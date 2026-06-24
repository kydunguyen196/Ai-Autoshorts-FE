"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useI18n } from "@/features/i18n/language-context";
import { formatDateTime } from "@/lib/utils";
import { listAdminNewsItems, listAdminNewsSources } from "@/services/admin-service";

export default function AdminNewsPage() {
  const { t } = useI18n();
  const [itemsPage, setItemsPage] = useState(0);

  const sourcesQuery = useQuery({
    queryKey: ["admin", "news", "sources"],
    queryFn: () => listAdminNewsSources({ page: 0, limit: 100 }),
  });

  const itemsQuery = useQuery({
    queryKey: ["admin", "news", "items", itemsPage],
    queryFn: () => listAdminNewsItems({ page: itemsPage, limit: 20 }),
    refetchInterval: 30_000,
  });

  return (
    <div>
      <PageHeader
        title={t("admin.news.title", "News (global)")}
        description={t("admin.news.description", "All RSS sources and ingested items across every user.")}
      />

      <section className="mb-6">
        <Card>
          <h2 className="text-lg font-semibold text-foreground">{t("admin.news.sources", "Sources")}</h2>
          {sourcesQuery.isLoading ? (
            <p className="mt-4 text-sm text-muted">{t("common.loading", "Loading…")}</p>
          ) : sourcesQuery.data && sourcesQuery.data.items.length > 0 ? (
            <div className="mt-4 overflow-x-auto rounded-xl border border-border">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-subtle text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t("admin.news.colName", "Name")}</th>
                    <th className="px-4 py-3 font-medium">{t("admin.news.colFeed", "Feed")}</th>
                    <th className="px-4 py-3 font-medium">{t("admin.news.colEnabled", "Enabled")}</th>
                    <th className="px-4 py-3 font-medium">{t("admin.news.colAuto", "Auto")}</th>
                    <th className="px-4 py-3 font-medium">{t("admin.news.colLast", "Last fetch")}</th>
                  </tr>
                </thead>
                <tbody>
                  {sourcesQuery.data.items.map((source) => (
                    <tr key={source.id} className="border-t border-border">
                      <td className="px-4 py-3 text-foreground">{source.name}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-muted">{source.feedUrl}</td>
                      <td className="px-4 py-3">
                        <Badge intent={source.enabled ? "success" : "neutral"}>
                          {source.enabled ? "ON" : "OFF"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {source.autoPublish ? <Badge intent="accent">AUTO</Badge> : <span className="text-muted">-</span>}
                      </td>
                      <td className="px-4 py-3 text-muted">{formatDateTime(source.lastFetchedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title={t("admin.news.noSources", "No news sources")}
              description={t("admin.news.noSourcesDesc", "No RSS sources have been configured yet.")}
            />
          )}
        </Card>
      </section>

      <section>
        <Card>
          <h2 className="text-lg font-semibold text-foreground">{t("admin.news.items", "Ingested items")}</h2>
          {itemsQuery.isLoading ? (
            <p className="mt-4 text-sm text-muted">{t("common.loading", "Loading…")}</p>
          ) : itemsQuery.data && itemsQuery.data.items.length > 0 ? (
            <div className="mt-4 overflow-x-auto rounded-xl border border-border">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-subtle text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t("admin.news.colTitle", "Title")}</th>
                    <th className="px-4 py-3 font-medium">{t("admin.news.colStatus", "Status")}</th>
                    <th className="px-4 py-3 font-medium">{t("admin.news.colIngested", "Ingested")}</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsQuery.data.items.map((item) => (
                    <tr key={item.id} className="border-t border-border">
                      <td className="max-w-md px-4 py-3 text-foreground">
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noreferrer" className="hover:text-accent">
                            {item.title}
                          </a>
                        ) : (
                          item.title
                        )}
                      </td>
                      <td className="px-4 py-3 text-strong">{item.status}</td>
                      <td className="px-4 py-3 text-muted">{formatDateTime(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title={t("admin.news.noItems", "No items")}
              description={t("admin.news.noItemsDesc", "Nothing has been ingested yet.")}
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
