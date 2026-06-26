"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { getAnalyticsSummary } from "@/services/analytics-service";
import type { AnalyticsCount, AnalyticsDailyPoint, AnalyticsSummaryResponse } from "@/types/api";

const WINDOW_OPTIONS = [7, 14, 30, 90];

export default function AnalyticsPage() {
  const [windowDays, setWindowDays] = useState(30);

  const summaryQuery = useQuery({
    queryKey: ["analytics", "summary", windowDays],
    queryFn: () => getAnalyticsSummary(windowDays),
  });

  const summary = summaryQuery.data;

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Job throughput, publish results, and estimated AI cost across your channels."
      />

      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-strong">Window</span>
        <Select
          className="w-40"
          value={String(windowDays)}
          onChange={(event) => setWindowDays(Number(event.target.value))}
        >
          {WINDOW_OPTIONS.map((days) => (
            <option key={days} value={days}>
              Last {days} days
            </option>
          ))}
        </Select>
      </div>

      {summaryQuery.isLoading ? (
        <Card>
          <p className="text-sm text-muted">Loading analytics...</p>
        </Card>
      ) : summaryQuery.isError ? (
        <Card>
          <p className="text-sm text-danger">Failed to load analytics.</p>
        </Card>
      ) : summary ? (
        <AnalyticsContent summary={summary} />
      ) : (
        <Card>
          <EmptyState title="No data" description="No analytics are available yet." />
        </Card>
      )}
    </div>
  );
}

function AnalyticsContent({ summary }: { summary: AnalyticsSummaryResponse }) {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Jobs" value={summary.totalJobs} />
        <StatCard label="Completed" value={summary.completedJobs} />
        <StatCard label="Success Rate" value={`${Math.round(summary.successRate * 100)}%`} />
        <StatCard label="Published" value={summary.publishedCount} />
        <StatCard label="Failed" value={summary.failedJobs} tone="danger" />
        <StatCard label="Est. AI Cost (credits)" value={summary.totalEstimatedCostCredits} />
      </section>

      <Card>
        <h2 className="text-lg font-semibold text-foreground">
          Jobs per day (last {summary.windowDays} days)
        </h2>
        <Timeseries points={summary.timeseries} />
      </Card>

      <section className="grid gap-4 xl:grid-cols-3">
        <BreakdownCard title="Jobs by status" counts={summary.jobsByStatus} />
        <BreakdownCard title="Publish by status" counts={summary.publishByStatus} />
        <BreakdownCard title="Published by platform" counts={summary.publishedByPlatform} />
      </section>
    </div>
  );
}

function Timeseries({ points }: { points: AnalyticsDailyPoint[] }) {
  if (!points.length) {
    return <p className="mt-4 text-sm text-muted">No activity in this window.</p>;
  }
  const max = Math.max(1, ...points.map((point) => point.jobs));

  return (
    <div className="mt-4 flex h-44 items-end gap-1 overflow-x-auto">
      {points.map((point) => {
        const heightPct = Math.round((point.jobs / max) * 100);
        const completedPct = point.jobs > 0 ? Math.round((point.completed / point.jobs) * 100) : 0;
        return (
          <div key={point.date} className="flex min-w-[10px] flex-1 flex-col items-center gap-1">
            <div
              className="relative flex w-full max-w-[26px] items-end justify-center rounded-t bg-border"
              style={{ height: `${Math.max(heightPct, point.jobs > 0 ? 6 : 0)}%` }}
              title={`${point.date}: ${point.jobs} jobs, ${point.completed} completed, ${point.costCredits} credits`}
            >
              <div
                className="w-full rounded-t bg-accent"
                style={{ height: `${completedPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BreakdownCard({ title, counts }: { title: string; counts: AnalyticsCount[] }) {
  const total = counts.reduce((sum, item) => sum + item.count, 0);
  return (
    <Card>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {counts.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No data.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {counts.map((item) => {
            const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
            return (
              <li key={item.key} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-strong">{item.key}</span>
                  <span className="text-muted">
                    {item.count} ({pct}%)
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-border">
                  <div className="h-1.5 rounded-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number | string;
  tone?: "default" | "danger";
}) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-faint">{label}</p>
      <p
        className={`mt-2 text-2xl font-semibold ${tone === "danger" ? "text-danger" : "text-foreground"}`}
      >
        {value}
      </p>
    </Card>
  );
}
