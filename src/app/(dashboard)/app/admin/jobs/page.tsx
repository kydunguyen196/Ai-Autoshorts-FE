"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Select } from "@/components/ui/select";
import { useI18n } from "@/features/i18n/language-context";
import { useToast } from "@/features/toast/toast-context";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import { listAdminJobs, retryAdminJob } from "@/services/admin-service";
import type { JobStatus } from "@/types/api";

const STATUSES: JobStatus[] = ["PENDING", "PROCESSING", "COMPLETED", "FAILED"];

export default function AdminJobsPage() {
  const { t } = useI18n();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<JobStatus | "">("");

  const jobsQuery = useQuery({
    queryKey: ["admin", "jobs", page, status],
    queryFn: () => listAdminJobs({ page, limit: 20, status: status || undefined }),
    refetchInterval: 15_000,
  });

  const retryMutation = useMutation({
    mutationFn: (id: string) => retryAdminJob(id),
    onSuccess: () => {
      toast.success(t("admin.jobs.retried", "Job re-queued"));
      queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div>
      <PageHeader
        title={t("admin.jobs.title", "All Jobs")}
        description={t("admin.jobs.description", "System-wide video generation jobs across all users.")}
      />

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as JobStatus | "");
              setPage(0);
            }}
          >
            <option value="">{t("admin.jobs.allStatuses", "All statuses")}</option>
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Button variant="secondary" size="sm" onClick={() => jobsQuery.refetch()}>
            {t("common.refresh", "Refresh")}
          </Button>
        </div>

        {jobsQuery.isLoading ? (
          <p className="text-sm text-muted">{t("common.loading", "Loading…")}</p>
        ) : jobsQuery.data && jobsQuery.data.items.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-subtle text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">{t("admin.jobs.colTopic", "Topic")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.jobs.colStatus", "Status")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.jobs.colStep", "Step")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.jobs.colCreated", "Created")}</th>
                  <th className="px-4 py-3 font-medium">{t("admin.jobs.colActions", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {jobsQuery.data.items.map((job) => (
                  <tr key={job.jobId} className="border-t border-border">
                    <td className="max-w-xs px-4 py-3">
                      <p className="truncate text-foreground">{job.topic}</p>
                      {job.errorMessage ? (
                        <p className="truncate text-[12px] text-danger">{job.errorMessage}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <Badge intent={statusIntent(job.status)}>{job.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-strong">{job.currentStep ?? "-"}</td>
                    <td className="px-4 py-3 text-muted">{formatDateTime(job.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={job.status !== "FAILED" || retryMutation.isPending}
                        onClick={() => retryMutation.mutate(job.jobId)}
                      >
                        {t("admin.jobs.retry", "Retry")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title={t("admin.jobs.empty", "No jobs found")}
            description={t("admin.jobs.emptyDesc", "No jobs match this filter.")}
          />
        )}

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

function statusIntent(status: JobStatus): "neutral" | "success" | "warning" | "danger" | "info" {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "FAILED":
      return "danger";
    case "PROCESSING":
      return "info";
    default:
      return "warning";
  }
}
