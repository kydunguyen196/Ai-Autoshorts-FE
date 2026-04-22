"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
import { PublishStatusBadge } from "@/features/jobs/publish-status-badge";
import { ReviewStatusBadge } from "@/features/jobs/review-status-badge";
import { useRetryJobMutation } from "@/hooks/use-retry-job";
import { useBootstrapMetadata } from "@/hooks/use-bootstrap";
import { formatDateTime, getErrorMessage, isTerminalJobStatus } from "@/lib/utils";
import {
  approveJob,
  getJobsFeed,
  publishJob,
  rejectJob,
  selectJobForPublish,
} from "@/services/jobs-service";
import type { JobStatus } from "@/types/api";

export default function JobsPage() {
  const queryClient = useQueryClient();
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

  const approveMutation = useMutation({
    mutationFn: (jobId: string) => approveJob(jobId),
    onSuccess: (job) => {
      invalidateJobCaches(queryClient, job.jobId);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (payload: { jobId: string; rejectionReason: string }) =>
      rejectJob(payload.jobId, { rejectionReason: payload.rejectionReason }),
    onSuccess: (job) => {
      invalidateJobCaches(queryClient, job.jobId);
    },
  });

  const selectMutation = useMutation({
    mutationFn: (jobId: string) => selectJobForPublish(jobId),
    onSuccess: (job) => {
      invalidateJobCaches(queryClient, job.jobId);
      if (job.generationGroupId) {
        queryClient.invalidateQueries({ queryKey: ["jobs", "group", job.generationGroupId] });
      }
    },
  });

  const publishMutation = useMutation({
    mutationFn: (payload: { jobId: string; publishPlatform?: string }) =>
      publishJob(payload.jobId, { publishPlatform: payload.publishPlatform }),
    onSuccess: (job) => {
      invalidateJobCaches(queryClient, job.jobId);
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

  const hasRunningMutation =
    retryMutation.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending ||
    selectMutation.isPending ||
    publishMutation.isPending;

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Track queue status and run review-to-publish actions for generated videos."
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

        {approveMutation.isError ? (
          <p className="mt-3 text-sm text-red-300">{getErrorMessage(approveMutation.error)}</p>
        ) : null}
        {rejectMutation.isError ? (
          <p className="mt-2 text-sm text-red-300">{getErrorMessage(rejectMutation.error)}</p>
        ) : null}
        {selectMutation.isError ? (
          <p className="mt-2 text-sm text-red-300">{getErrorMessage(selectMutation.error)}</p>
        ) : null}
        {publishMutation.isError ? (
          <p className="mt-2 text-sm text-red-300">{getErrorMessage(publishMutation.error)}</p>
        ) : null}

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
              <table className="min-w-[1280px] text-left text-sm">
                <thead className="bg-zinc-900/60 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Topic</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Step</th>
                    <th className="px-4 py-3 font-medium">Review</th>
                    <th className="px-4 py-3 font-medium">Publish</th>
                    <th className="px-4 py-3 font-medium">Group</th>
                    <th className="px-4 py-3 font-medium">Updated</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((job) => {
                    const canApprove = job.status === "COMPLETED" && job.reviewStatus !== "APPROVED";
                    const canReject = job.status === "COMPLETED";
                    const canSelect =
                      job.status === "COMPLETED" &&
                      job.reviewStatus === "APPROVED" &&
                      !job.selectedForPublish;
                    const canPublish =
                      job.status === "COMPLETED" &&
                      job.reviewStatus === "APPROVED" &&
                      job.publishStatus !== "PUBLISHED" &&
                      job.publishStatus !== "PUBLISHING";

                    return (
                      <tr key={job.jobId} className="border-t border-zinc-800/80 align-top">
                        <td className="px-4 py-3 text-zinc-100">
                          <p className="font-medium">{job.topic}</p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {job.style}
                            {job.variantIndex && job.variantCount
                              ? ` • variant ${job.variantIndex}/${job.variantCount}`
                              : ""}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <JobStatusBadge status={job.status} />
                        </td>
                        <td className="px-4 py-3">
                          <JobStepBadge step={job.currentStep} />
                        </td>
                        <td className="px-4 py-3">
                          <ReviewStatusBadge status={job.reviewStatus} />
                          {job.selectedForPublish ? <p className="mt-1 text-xs text-emerald-300">Selected</p> : null}
                        </td>
                        <td className="px-4 py-3">
                          <PublishStatusBadge status={job.publishStatus} />
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-500">{job.generationGroupId || "-"}</td>
                        <td className="px-4 py-3 text-zinc-400">{formatDateTime(job.updatedAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
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
                                disabled={hasRunningMutation}
                              >
                                Retry
                              </Button>
                            ) : null}

                            {canApprove ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => approveMutation.mutate(job.jobId)}
                                disabled={hasRunningMutation}
                              >
                                Approve
                              </Button>
                            ) : null}

                            {canReject ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const reason = window.prompt("Enter rejection reason", job.rejectionReason || "");
                                  if (!reason || !reason.trim()) {
                                    return;
                                  }
                                  rejectMutation.mutate({
                                    jobId: job.jobId,
                                    rejectionReason: reason.trim(),
                                  });
                                }}
                                disabled={hasRunningMutation}
                              >
                                Reject
                              </Button>
                            ) : null}

                            {canSelect ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => selectMutation.mutate(job.jobId)}
                                disabled={hasRunningMutation}
                              >
                                Select
                              </Button>
                            ) : null}

                            {canPublish ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const platform =
                                    window.prompt("Publish platform", job.publishPlatform || "tiktok")?.trim() ||
                                    undefined;
                                  publishMutation.mutate({
                                    jobId: job.jobId,
                                    publishPlatform: platform,
                                  });
                                }}
                                disabled={hasRunningMutation}
                              >
                                Publish
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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

function invalidateJobCaches(queryClient: ReturnType<typeof useQueryClient>, jobId: string) {
  queryClient.invalidateQueries({ queryKey: ["jobs", "feed"] });
  queryClient.invalidateQueries({ queryKey: ["jobs", "recent"] });
  queryClient.invalidateQueries({ queryKey: ["jobs", "detail", jobId] });
  queryClient.invalidateQueries({ queryKey: ["jobs", "publish-status", jobId] });
}
