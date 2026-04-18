"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { JobStatusBadge } from "@/features/jobs/job-status-badge";
import { JobStepBadge } from "@/features/jobs/job-step-badge";
import { useRetryJobMutation } from "@/hooks/use-retry-job";
import { formatDateTime, isTerminalJobStatus } from "@/lib/utils";
import { getJob } from "@/services/jobs-service";

export default function JobDetailPage() {
  const params = useParams<{ jobId: string }>();
  const retryMutation = useRetryJobMutation();
  const jobId = params.jobId;

  const jobQuery = useQuery({
    queryKey: ["jobs", "detail", jobId],
    queryFn: () => getJob(jobId),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && !isTerminalJobStatus(status) ? 4_000 : false;
    },
  });

  const job = jobQuery.data;

  return (
    <div>
      <PageHeader
        title="Job Detail"
        description="Inspect generation status, step progression, and output artifacts."
        action={
          <Link href="/app/jobs">
            <Button variant="secondary">Back to Jobs</Button>
          </Link>
        }
      />

      {jobQuery.isLoading ? (
        <Card>
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        </Card>
      ) : jobQuery.isError || !job ? (
        <Card>
          <p className="text-sm text-red-300">Unable to load job details.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-zinc-100">{job.topic}</h2>
                <p className="mt-2 text-sm text-zinc-400">Job ID: {job.jobId}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <JobStatusBadge status={job.status} />
                <JobStepBadge step={job.currentStep} />
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
              <InfoRow label="Style" value={job.style} />
              <InfoRow label="Voice ID" value={job.voiceId || "-"} />
              <InfoRow label="Duration" value={`${job.durationSeconds}s`} />
              <InfoRow label="Attempt" value={String(job.attemptCount ?? 0)} />
              <InfoRow label="Created" value={formatDateTime(job.createdAt)} />
              <InfoRow label="Updated" value={formatDateTime(job.updatedAt)} />
              <InfoRow label="Started" value={formatDateTime(job.startedAt)} />
              <InfoRow label="Completed" value={formatDateTime(job.completedAt)} />
            </div>

            {job.errorMessage ? (
              <div className="mt-5 rounded-xl border border-red-700/60 bg-red-500/10 p-4">
                <p className="text-sm font-medium text-red-200">Error</p>
                <p className="mt-1 text-sm text-red-100">{job.errorMessage}</p>
                {job.stepErrorDetails ? (
                  <pre className="mt-3 max-h-60 overflow-auto rounded-lg bg-black/40 p-3 text-xs text-red-100">
                    {job.stepErrorDetails}
                  </pre>
                ) : null}
              </div>
            ) : null}

            {job.status === "FAILED" ? (
              <div className="mt-5">
                <Button onClick={() => retryMutation.mutate(job.jobId)} disabled={retryMutation.isPending}>
                  Retry Job
                </Button>
              </div>
            ) : null}
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-zinc-100">Generated Metadata</h3>
            <div className="mt-4 space-y-4 text-sm">
              <MetaBlock title="Hook" value={job.hookText} />
              <MetaBlock title="Script" value={job.scriptText} />
              <MetaBlock title="CTA" value={job.ctaText} />
              <MetaBlock title="Caption" value={job.captionText} />
              <MetaBlock
                title="Hashtags"
                value={job.hashtags?.length ? job.hashtags.join(" ") : undefined}
              />
              <MetaBlock title="Resolved Style" value={job.resolvedStyle || undefined} />
              <MetaBlock title="Prompt Template" value={job.promptTemplateId || undefined} />
              <MetaBlock title="Scene Breakdown JSON" value={job.sceneBreakdownJson || undefined} isCode />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-zinc-100">Output Assets</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <AssetRow label="Audio URL" url={job.audioUrl} />
              <AssetRow label="Subtitle URL" url={job.subtitleUrl} />
              <AssetRow label="Final Video URL" url={job.finalVideoUrl} />
            </div>

            {job.finalVideoUrl ? (
              <div className="mt-5 overflow-hidden rounded-xl border border-zinc-800">
                <video controls className="w-full" src={job.finalVideoUrl} />
              </div>
            ) : null}
          </Card>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-zinc-100">{value}</p>
    </div>
  );
}

function MetaBlock({
  title,
  value,
  isCode = false,
}: {
  title: string;
  value?: string | null;
  isCode?: boolean;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{title}</p>
      {value ? (
        isCode ? (
          <pre className="mt-2 max-h-64 overflow-auto rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 text-xs text-zinc-200">
            {value}
          </pre>
        ) : (
          <p className="mt-1 whitespace-pre-wrap text-zinc-200">{value}</p>
        )
      ) : (
        <p className="mt-1 text-zinc-500">-</p>
      )}
    </div>
  );
}

function AssetRow({ label, url }: { label: string; url?: string | null }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      {url ? (
        <a className="mt-1 inline-block break-all text-indigo-300 hover:text-indigo-200" href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
      ) : (
        <p className="mt-1 text-zinc-500">Not available yet</p>
      )}
    </div>
  );
}
