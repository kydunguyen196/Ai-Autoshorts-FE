"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock3, Layers, ListChecks, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    jobsQuery.data?.filter((job) => job.status === "PENDING" || job.status === "PROCESSING").length ?? 0;

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

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-zinc-400">Recent Jobs</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-100">{jobCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-400">Processing Queue</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-100">{processingCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-400">Recent Topics</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-100">{topicCount}</p>
        </Card>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-100">Latest Jobs</h2>
            <Link href="/app/jobs" className="text-sm text-indigo-300 hover:text-indigo-200">
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
            <p className="text-sm text-red-300">Failed to load jobs.</p>
          ) : jobsQuery.data && jobsQuery.data.length > 0 ? (
            <div className="space-y-3">
              {jobsQuery.data.map((job) => (
                <Link
                  key={job.jobId}
                  href={`/app/jobs/${job.jobId}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 hover:border-indigo-500/50"
                >
                  <div>
                    <p className="font-medium text-zinc-100">{job.topic}</p>
                    <p className="mt-1 text-xs text-zinc-400">{formatDateTime(job.createdAt)}</p>
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

        <Card>
          <h2 className="text-lg font-semibold text-zinc-100">System Snapshot</h2>
          <div className="mt-4 space-y-3 text-sm text-zinc-300">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
              <p className="text-zinc-500">Queue Enabled</p>
              <p className="mt-1 font-medium text-zinc-100">
                {healthQuery.data?.queueEnabled ? "Yes" : "No"}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
              <p className="text-zinc-500">Queue Name</p>
              <p className="mt-1 font-medium text-zinc-100">{healthQuery.data?.queueName ?? "-"}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
              <p className="text-zinc-500">Max Processing Attempts</p>
              <p className="mt-1 font-medium text-zinc-100">
                {healthQuery.data?.queueMaxProcessingAttempts ?? "-"}
              </p>
            </div>
          </div>
        </Card>
      </section>

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

      <section className="mt-6">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-indigo-300" />
            <h2 className="text-lg font-semibold text-zinc-100">Recent Topics</h2>
          </div>

          {topicsQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : topicsQuery.isError ? (
            <p className="text-sm text-red-300">Failed to load topics.</p>
          ) : topicsQuery.data && topicsQuery.data.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {topicsQuery.data.map((topic) => (
                <div key={topic.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                  <p className="font-medium text-zinc-100">{topic.topic}</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {topic.contentStyle || "No style"} • {topic.status}
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
    <Link href={href} className="group">
      <Card className="h-full transition hover:border-indigo-500/60 hover:bg-zinc-900/70">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-200">
          {icon}
        </div>
        <h3 className="mt-4 text-base font-semibold text-zinc-100">{title}</h3>
        <p className="mt-2 text-sm text-zinc-400">{description}</p>
        <span className="mt-5 inline-flex items-center gap-1 text-sm text-indigo-300 group-hover:text-indigo-200">
          Open <ArrowRight className="h-4 w-4" />
        </span>
      </Card>
    </Link>
  );
}
