"use client";

import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useI18n } from "@/features/i18n/language-context";
import { getAdminOverview } from "@/services/admin-service";

export default function AdminOverviewPage() {
  const { t } = useI18n();
  const overviewQuery = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: getAdminOverview,
    refetchInterval: 30_000,
  });

  const data = overviewQuery.data;

  return (
    <div>
      <PageHeader
        title={t("admin.overview.title", "Admin Overview")}
        description={t("admin.overview.description", "System-wide health, usage and runtime configuration.")}
      />

      {overviewQuery.isLoading ? (
        <p className="text-sm text-muted">{t("common.loading", "Loading…")}</p>
      ) : overviewQuery.isError || !data ? (
        <p className="text-sm text-danger">{t("admin.overview.loadError", "Failed to load overview.")}</p>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label={t("admin.stat.totalUsers", "Total users")} value={data.totalUsers} />
            <Stat label={t("admin.stat.enabledUsers", "Active users")} value={data.enabledUsers} />
            <Stat label={t("admin.stat.jobs24h", "Jobs (24h)")} value={data.jobsLast24h} />
            <Stat label={t("admin.stat.jobs7d", "Jobs (7d)")} value={data.jobsLast7d} />
            <Stat label={t("admin.stat.pending", "Pending")} value={data.jobsPending} />
            <Stat label={t("admin.stat.processing", "Processing")} value={data.jobsProcessing} />
            <Stat label={t("admin.stat.completed", "Completed")} value={data.jobsCompleted} />
            <Stat label={t("admin.stat.failed", "Failed")} value={data.jobsFailed} intent="danger" />
          </section>

          <section className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="text-lg font-semibold text-foreground">
                {t("admin.runtime.title", "Runtime status")}
              </h2>
              <div className="mt-4 space-y-3">
                <ToggleRow
                  label={t("admin.runtime.scheduler", "Topic scheduler")}
                  on={data.schedulerEnabled}
                />
                <ToggleRow label={t("admin.runtime.news", "News ingestion")} on={data.newsEnabled} />
                <ToggleRow label={t("admin.runtime.queue", "Queue")} on={data.queueEnabled} />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-strong">
                    {t("admin.runtime.newsSources", "Enabled news sources")}
                  </span>
                  <span className="font-mono text-sm text-foreground">{data.newsSourcesEnabled}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-foreground">
                {t("admin.providers.title", "Provider modes")}
              </h2>
              <div className="mt-4 space-y-3">
                {Object.entries(data.providerModes ?? {}).map(([key, mode]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-strong">{key}</span>
                    <Badge intent={mode === "REAL" ? "success" : mode === "MOCK" ? "warning" : "info"}>
                      {String(mode)}
                    </Badge>
                  </div>
                ))}
                {Object.keys(data.providerModes ?? {}).length === 0 ? (
                  <p className="text-sm text-muted">{t("admin.providers.none", "No provider data.")}</p>
                ) : null}
              </div>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  intent = "neutral",
}: {
  label: string;
  value: number;
  intent?: "neutral" | "danger";
}) {
  return (
    <Card>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{label}</p>
      <p
        className={`mt-2 text-[32px] font-semibold leading-none ${
          intent === "danger" && value > 0 ? "text-danger" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </Card>
  );
}

function ToggleRow({ label, on }: { label: string; on: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-strong">{label}</span>
      <Badge intent={on ? "success" : "neutral"}>{on ? "ON" : "OFF"}</Badge>
    </div>
  );
}
