"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Layers, ListChecks, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { JobStatusBadge } from "@/features/jobs/job-status-badge";
import { getHealth } from "@/services/health-service";
import { listRecentJobs } from "@/services/jobs-service";
import { listRecentTopics } from "@/services/topics-service";
import { formatDateTime } from "@/lib/utils";

export default function DashboardHomePage() {
  const jobsQuery = useQuery({
    queryKey: ["jobs", "recent", 5],
    queryFn: () => listRecentJobs(5),
  });
  const topicsQuery = useQuery({
    queryKey: ["topics", "recent", 5],
    queryFn: () => listRecentTopics(5),
  });
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    staleTime: 30_000,
  });

  const jobCount = jobsQuery.data?.length ?? 0;
  const topicCount = topicsQuery.data?.length ?? 0;
  const processingCount =
    jobsQuery.data?.filter((j) => j.status === "PENDING" || j.status === "PROCESSING").length ?? 0;

  return (
    <div>
      <PageHeader
        title="Creator Operations"
        description="Monitor generation throughput, curate topics, and launch new video jobs."
        action={
          <Link href="/app/generate">
            <Button className="gap-2">
              New Video <Sparkles className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      {/* -- Stat tiles --------------------------------------------------- */}
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Recent Jobs" value={jobCount} />
        <StatCard label="Processing Queue" value={processingCount} />
        <StatCard label="Recent Topics" value={topicCount} />
      </section>

      {/* -- Latest jobs + system snapshot -------------------------------- */}
      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[21px] font-semibold  text-foreground">
              Latest Jobs
            </h2>
            <Link
              href="/app/jobs"
              className="text-[14px]  text-foreground hover:underline"
            >
              View all
            </Link>
          </div>

          {jobsQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : jobsQuery.isError ? (
            <p className="text-[17px] text-danger">Failed to load jobs.</p>
          ) : jobsQuery.data && jobsQuery.data.length > 0 ? (
            <div className="space-y-2">
              {jobsQuery.data.map((job) => (
                <Link
                  key={job.jobId}
                  href={`/app/jobs/${job.jobId}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 transition-colors hover:border-border-strong hover:bg-surface"
                >
                  <div>
                    <p className="text-[17px] font-normal  text-foreground">
                      {job.topic}
                    </p>
                    <p className="mt-0.5 text-[12px]  text-muted">
                      {formatDateTime(job.createdAt)}
                    </p>
                  </div>
                  <JobStatusBadge status={job.status} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No jobs yet"
              description="Start your first generation job to populate this dashboard."
              action={
                <Link href="/app/generate">
                  <Button size="sm">Generate Video</Button>
                </Link>
              }
            />
          )}
        </Card>

        {/* System snapshot */}
        <Card>
          <h2 className="text-[21px] font-semibold  text-foreground">
            System Snapshot
          </h2>
          <div className="mt-4 space-y-2">
            <SnapshotRow label="Queue Enabled" value={healthQuery.data?.queueEnabled ? "Yes" : "No"} />
            <SnapshotRow label="Queue Name" value={healthQuery.data?.queueName ?? "—"} />
            <SnapshotRow
              label="Max Attempts"
              value={String(healthQuery.data?.queueMaxProcessingAttempts ?? "—")}
            />
          </div>
        </Card>
      </section>

      {/* -- Quick actions ------------------------------------------------- */}
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <QuickActionCard
          href="/app/generate"
          icon={<Sparkles className="h-5 w-5" />}
          title="Single Generate"
          description="Create one queued video job with full metadata tracking."
        />
        <QuickActionCard
          href="/app/batch"
          icon={<ListChecks className="h-5 w-5" />}
          title="Batch Generate"
          description="Submit multiple topics in one request and review acceptance summary."
        />
        <QuickActionCard
          href="/app/topics"
          icon={<Layers className="h-5 w-5" />}
          title="Topic Pipeline"
          description="Create/import topics and keep your production queue warm."
        />
      </section>

      {/* -- Recent topics ------------------------------------------------- */}
      <section className="mt-6">
        <Card>
          <h2 className="mb-5 text-[21px] font-semibold  text-foreground">
            Recent Topics
          </h2>

          {topicsQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : topicsQuery.isError ? (
            <p className="text-[17px] text-danger">Failed to load topics.</p>
          ) : topicsQuery.data && topicsQuery.data.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {topicsQuery.data.map((topic) => (
                <div
                  key={topic.id}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <p className="text-[17px]  text-foreground">{topic.topic}</p>
                  <p className="mt-1 text-[12px]  text-muted">
                    {topic.contentStyle || "No style"} · {topic.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No topics yet"
              description="Create or import topics to start feeding the generation queue."
              action={
                <Link href="/app/topics">
                  <Button size="sm">Manage Topics</Button>
                </Link>
              }
            />
          )}
        </Card>
      </section>
    </div>
  );
}

/* -- Sub-components -------------------------------------------------------- */

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="card-hover">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-muted">{label}</p>
      </div>
      <p className="gradient-text mt-3 text-[44px] font-semibold leading-[1.05]">{value}</p>
    </Card>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <p className="text-[12px]  text-muted">{label}</p>
      <p className="mt-0.5 text-[17px]  text-foreground">{value}</p>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="card-hover h-full">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-on-accent glow-accent">
          {icon}
        </div>
        <h3 className="mt-4 text-[21px] font-semibold  text-foreground">{title}</h3>
        <p className="mt-2 text-[17px] leading-[1.47]  text-muted">
          {description}
        </p>
        <span className="mt-5 inline-flex items-center gap-1 text-[17px]  text-foreground group-hover:underline">
          Open <ArrowRight className="h-4 w-4" />
        </span>
      </Card>
    </Link>
  );
}
