"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { JobStatusBadge } from "@/features/jobs/job-status-badge";
import { JobStepBadge } from "@/features/jobs/job-step-badge";
import { useRetryJobMutation } from "@/hooks/use-retry-job";
import { useBootstrapMetadata } from "@/hooks/use-bootstrap";
import { isTerminalJobStatus, formatDateTime } from "@/lib/utils";
import { getJobsFeed } from "@/services/jobs-service";
import type { JobStatus } from "@/types/api";

export default function JobsPage() {
  const bootstrapQuery = useBootstrapMetadata();
  const retryMutation = useRetryJobMutation();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [status, setStatus] = useState<JobStatus | "">("");
  const [search, setSearch] = useState("");

  const jobsQuery = useQuery({
    queryKey: ["jobs", "feed", page, limit, status],
    queryFn: () =>
      getJobsFeed({
        page,
        limit,
        status: status || undefined,
      }),
    refetchInterval: (query) => {
      const jobs = query.state.data?.items ?? [];
      return jobs.some((job) => !isTerminalJobStatus(job.status)) ? 5_000 : false;
    },
  });

  const statuses = bootstrapQuery.data?.videoStatuses ?? ["PENDING", "PROCESSING", "COMPLETED", "FAILED"];

  const filteredItems = useMemo(() => {
    const items = jobsQuery.data?.items ?? [];
    if (!search.trim()) {
      return items;
    }

    const searchLower = search.trim().toLowerCase();
    return items.filter((job) => {
      const content = `${job.topic} ${job.style} ${job.voiceId ?? ""}`.toLowerCase();
      return content.includes(searchLower);
    });
  }, [jobsQuery.data?.items, search]);

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Track queued generation, monitor processing, and inspect output details."
        action={
          <Link href="/app/generate">
            <Button>Generate Video</Button>
          </Link>
        }
      />

      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <Input
            placeholder="Search topic/style/voice"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as JobStatus | "");
              setPage(0);
            }}
          >
            <option value="">All statuses</option>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select
            value={String(limit)}
            onChange={(event) => {
              setLimit(Number(event.target.value));
              setPage(0);
            }}
          >
            {[10, 20, 50].map((item) => (
              <option key={item} value={item}>
                {item} / page
              </option>
            ))}
          </Select>
          <Button variant="secondary" onClick={() => jobsQuery.refetch()}>
            Refresh
          </Button>
        </div>

        <div className="mt-5">
          {jobsQuery.isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : jobsQuery.isError ? (
            <p className="text-sm text-red-300">Failed to load jobs feed.</p>
          ) : filteredItems.length === 0 ? (
            <EmptyState
              title="No jobs found"
              description="No jobs match your current filters."
              action={
                <Link href="/app/generate">
                  <Button size="sm">Create first job</Button>
                </Link>
              }
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-zinc-900/60 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Topic</th>
                    <th className="px-4 py-3 font-medium">Style</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Step</th>
                    <th className="px-4 py-3 font-medium">Updated</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((job) => (
                    <tr key={job.jobId} className="border-t border-zinc-800/80">
                      <td className="px-4 py-3 text-zinc-100">{job.topic}</td>
                      <td className="px-4 py-3 text-zinc-300">{job.style}</td>
                      <td className="px-4 py-3">
                        <JobStatusBadge status={job.status} />
                      </td>
                      <td className="px-4 py-3">
                        <JobStepBadge step={job.currentStep} />
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{formatDateTime(job.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link href={`/app/jobs/${job.jobId}`}>
                            <Button variant="secondary" size="sm">
                              View
                            </Button>
                          </Link>
                          {job.status === "FAILED" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => retryMutation.mutate(job.jobId)}
                              disabled={retryMutation.isPending}
                            >
                              Retry
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {jobsQuery.data ? (
          <PaginationControls
            page={jobsQuery.data.page}
            totalPages={jobsQuery.data.totalPages}
            hasPrevious={jobsQuery.data.hasPrevious}
            hasNext={jobsQuery.data.hasNext}
            onChange={(nextPage) => setPage(Math.max(nextPage, 0))}
          />
        ) : null}
      </Card>
    </div>
  );
}
