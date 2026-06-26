"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { JobDraftEditor } from "@/components/jobs/job-draft-editor";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { JobStatusBadge } from "@/features/jobs/job-status-badge";
import { JobStepBadge } from "@/features/jobs/job-step-badge";
import { PublishStatusBadge } from "@/features/jobs/publish-status-badge";
import { ReviewStatusBadge } from "@/features/jobs/review-status-badge";
import { useRetryJobMutation } from "@/hooks/use-retry-job";
import { formatDateTime, getErrorMessage, isTerminalJobStatus } from "@/lib/utils";
import {
  approveJob,
  exportJob,
  getGroupReviewSummary,
  getJob,
  getJobPublishStatus,
  getTopCandidatesByGroup,
  publishJob,
  rejectJob,
  selectJobForPublish,
} from "@/services/jobs-service";

export default function JobDetailPage() {
  const params = useParams<{ jobId: string }>();
  const queryClient = useQueryClient();
  const retryMutation = useRetryJobMutation();
  const jobId = params.jobId;

  const [rejectReason, setRejectReason] = useState("");
  const [publishPlatform, setPublishPlatform] = useState("tiktok");

  const jobQuery = useQuery({
    queryKey: ["jobs", "detail", jobId],
    queryFn: () => getJob(jobId),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && !isTerminalJobStatus(status) ? 4_000 : false;
    },
  });

  const publishStatusQuery = useQuery({
    queryKey: ["jobs", "publish-status", jobId],
    queryFn: () => getJobPublishStatus(jobId),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const status = query.state.data?.publishStatus;
      return status === "PUBLISHING" ? 4_000 : false;
    },
  });

  const groupId = jobQuery.data?.generationGroupId;

  const groupReviewSummaryQuery = useQuery({
    queryKey: ["jobs", "group", groupId, "review-summary"],
    queryFn: () => getGroupReviewSummary(groupId as string),
    enabled: Boolean(groupId),
  });

  const topCandidatesQuery = useQuery({
    queryKey: ["jobs", "group", groupId, "top-candidates"],
    queryFn: () => getTopCandidatesByGroup(groupId as string, { page: 0, limit: 5 }),
    enabled: Boolean(groupId),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveJob(id),
    onSuccess: (job) => {
      refreshJobData(queryClient, job.jobId);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (payload: { id: string; reason: string }) =>
      rejectJob(payload.id, { rejectionReason: payload.reason }),
    onSuccess: (job) => {
      refreshJobData(queryClient, job.jobId);
      setRejectReason("");
    },
  });

  const selectMutation = useMutation({
    mutationFn: (id: string) => selectJobForPublish(id),
    onSuccess: (job) => {
      refreshJobData(queryClient, job.jobId);
      if (job.generationGroupId) {
        queryClient.invalidateQueries({ queryKey: ["jobs", "group", job.generationGroupId] });
      }
    },
  });

  const publishMutation = useMutation({
    mutationFn: (payload: { id: string; platform?: string }) =>
      publishJob(payload.id, { publishPlatform: payload.platform }),
    onSuccess: (job) => {
      refreshJobData(queryClient, job.jobId);
      queryClient.invalidateQueries({ queryKey: ["jobs", "publish-status", job.jobId] });
    },
  });

  const exportMutation = useMutation({
    mutationFn: (id: string) => exportJob(id),
    onSuccess: (job) => {
      refreshJobData(queryClient, job.jobId);
    },
  });

  const job = jobQuery.data;
  const publishStatus = publishStatusQuery.data;

  const canApprove = job?.status === "COMPLETED" && job.reviewStatus !== "APPROVED";
  const canReject = job?.status === "COMPLETED";
  const canSelect =
    job?.status === "COMPLETED" &&
    job.reviewStatus === "APPROVED" &&
    !job.selectedForPublish;
  const canPublish =
    job?.status === "COMPLETED" &&
    job.reviewStatus === "APPROVED" &&
    publishStatus?.publishable !== false &&
    job.publishStatus !== "PUBLISHED" &&
    job.publishStatus !== "PUBLISHING";

  const reviewCountRows = useMemo(() => {
    const counts = groupReviewSummaryQuery.data?.reviewStatusCounts;
    if (!counts) {
      return [];
    }
    return Object.entries(counts);
  }, [groupReviewSummaryQuery.data?.reviewStatusCounts]);

  const failureDetails = useMemo(
    () => parseStepErrorDetails(job?.stepErrorDetails),
    [job?.stepErrorDetails],
  );

  const hasActionPending =
    retryMutation.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending ||
    selectMutation.isPending ||
    publishMutation.isPending ||
    exportMutation.isPending;

  return (
    <div>
      <PageHeader
        title="Job Detail"
        description="Inspect generation outputs, review status, and publish readiness."
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
          <p className="text-sm text-danger">Unable to load job details.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <JobDraftEditor job={job} />
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-foreground">{job.topic}</h2>
                <p className="mt-2 text-sm text-muted">Job ID: {job.jobId}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <JobStatusBadge status={job.status} />
                <JobStepBadge step={job.currentStep} />
                <ReviewStatusBadge status={job.reviewStatus} />
                <PublishStatusBadge status={job.publishStatus} />
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-strong md:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="Style" value={job.style} />
              <InfoRow label="Voice ID" value={job.voiceId || "-"} />
              <InfoRow label="Duration" value={`${job.durationSeconds}s`} />
              <InfoRow label="Review Status" value={job.reviewStatus || "-"} />
              <InfoRow label="Selected For Publish" value={job.selectedForPublish ? "Yes" : "No"} />
              <InfoRow label="Publish Status" value={job.publishStatus || "-"} />
              <InfoRow label="Export Status" value={job.exportStatus || "-"} />
              <InfoRow label="Estimated Credits" value={String(job.estimatedCostCredits ?? "-")} />
              <InfoRow label="Provider Modes" value={job.providerModes || "-"} />
              <InfoRow label="Niche" value={job.niche || "-"} />
              <InfoRow label="Platform" value={job.platform || "-"} />
              <InfoRow label="Quality Preset" value={job.qualityPreset || "-"} />
              <InfoRow label="Subtitle Style" value={job.subtitleStyle || "-"} />
              <InfoRow label="Visual Mode" value={job.visualMode || "-"} />
              <InfoRow label="Voice Persona" value={job.voicePersona || "-"} />
              <InfoRow label="Attempt" value={String(job.attemptCount ?? 0)} />
              <InfoRow label="Created" value={formatDateTime(job.createdAt)} />
              <InfoRow label="Updated" value={formatDateTime(job.updatedAt)} />
              <InfoRow label="Started" value={formatDateTime(job.startedAt)} />
              <InfoRow label="Completed" value={formatDateTime(job.completedAt)} />
              <InfoRow label="Generation Group" value={job.generationGroupId || "-"} />
            </div>

            {job.errorMessage ? (
              <div className="mt-5 rounded-xl border border-danger/30 bg-danger/10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-danger">Generation failed</p>
                    <p className="mt-1 text-sm text-danger">{job.errorMessage}</p>
                  </div>
                  <div className="rounded-full border border-red-700/70 px-3 py-1 text-xs text-danger">
                    {getGenerationStepLabel(failureDetails.step || job.currentStep)}
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-sm md:grid-cols-3">
                  <InfoRow label="Failed Step" value={getGenerationStepLabel(failureDetails.step || job.currentStep)} />
                  <InfoRow label="Last Error" value={formatDateTime(job.lastErrorAt)} />
                  <InfoRow label="Attempt" value={String(job.attemptCount ?? 0)} />
                </div>

                {failureDetails.exception || failureDetails.rootCauseMessage ? (
                  <div className="mt-4 rounded-xl border border-danger/30 bg-surface p-3 text-xs text-danger">
                    {failureDetails.rootCauseMessage ? (
                      <p>
                        <span className="text-danger">Root cause:</span> {failureDetails.rootCauseMessage}
                      </p>
                    ) : null}
                    {failureDetails.exception ? (
                      <p className="mt-1">
                        <span className="text-danger">Exception:</span> {failureDetails.exception}
                      </p>
                    ) : null}
                    {failureDetails.occurredAt ? (
                      <p className="mt-1">
                        <span className="text-danger">Captured:</span> {formatDateTime(failureDetails.occurredAt)}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {job.stepErrorDetails ? (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs font-medium text-danger hover:text-danger">
                      Show technical details
                    </summary>
                    <pre className="mt-3 max-h-60 overflow-auto rounded-xl bg-foreground p-3 text-xs text-danger">
                      {job.stepErrorDetails}
                    </pre>
                  </details>
                ) : null}
              </div>
            ) : null}

            {job.status === "FAILED" ? (
              <div className="mt-5">
                <Button onClick={() => retryMutation.mutate(job.jobId)} disabled={hasActionPending}>
                  Retry Job
                </Button>
              </div>
            ) : null}
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-foreground">Review Actions</h3>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => approveMutation.mutate(job.jobId)}
                disabled={!canApprove || hasActionPending}
              >
                Approve
              </Button>

              <Button
                variant="secondary"
                onClick={() => selectMutation.mutate(job.jobId)}
                disabled={!canSelect || hasActionPending}
              >
                Select For Publish
              </Button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
              <Input
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                placeholder="Rejection reason"
              />
              <Button
                variant="danger"
                onClick={() => rejectMutation.mutate({ id: job.jobId, reason: rejectReason.trim() })}
                disabled={!canReject || !rejectReason.trim() || hasActionPending}
              >
                Reject
              </Button>
            </div>

            {approveMutation.isError ? (
              <p className="mt-3 text-sm text-danger">{getErrorMessage(approveMutation.error)}</p>
            ) : null}
            {rejectMutation.isError ? (
              <p className="mt-2 text-sm text-danger">{getErrorMessage(rejectMutation.error)}</p>
            ) : null}
            {selectMutation.isError ? (
              <p className="mt-2 text-sm text-danger">{getErrorMessage(selectMutation.error)}</p>
            ) : null}
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-foreground">Publish Readiness</h3>

            {publishStatusQuery.isLoading ? (
              <p className="mt-3 text-sm text-muted">Loading publish status...</p>
            ) : publishStatusQuery.isError || !publishStatus ? (
              <p className="mt-3 text-sm text-danger">Failed to load publish status.</p>
            ) : (
              <>
                <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <InfoRow label="Publishable" value={publishStatus.publishable ? "Yes" : "No"} />
                  <InfoRow label="Readiness Reason" value={publishStatus.publishReadinessReason || "Ready"} />
                  <InfoRow label="TikTok Connection" value={publishStatus.tiktokConnectionStatus || "-"} />
                  <InfoRow label="Platform" value={publishStatus.publishPlatform || "-"} />
                  <InfoRow label="Provider" value={publishStatus.publishProvider || "-"} />
                  <InfoRow label="Attempt Count" value={String(publishStatus.publishAttemptCount ?? 0)} />
                  <InfoRow label="Requested At" value={formatDateTime(publishStatus.publishRequestedAt)} />
                  <InfoRow label="Published At" value={formatDateTime(publishStatus.publishedAt)} />
              <InfoRow label="External ID" value={publishStatus.publishExternalId || "-"} />
                  <InfoRow label="Export Status" value={job.exportStatus || "-"} />
                  <InfoRow label="Download URL" value={job.downloadUrl || "-"} />
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                  <Input
                    value={publishPlatform}
                    onChange={(event) => setPublishPlatform(event.target.value)}
                    placeholder="Publish platform (default tiktok)"
                  />
                  <Button
                    onClick={() =>
                      publishMutation.mutate({
                        id: job.jobId,
                        platform: publishPlatform.trim() || undefined,
                      })
                    }
                    disabled={!canPublish || hasActionPending}
                  >
                    Publish Now
                  </Button>
                </div>

                <div className="mt-3">
                  <Button
                    variant="secondary"
                    onClick={() => exportMutation.mutate(job.jobId)}
                    disabled={job.status !== "COMPLETED" || hasActionPending}
                  >
                    Prepare Download Export
                  </Button>
                </div>

                {publishStatus.publishFailureReason ? (
                  <div className="mt-4 rounded-xl border border-danger/30 bg-danger/10 p-4">
                    <p className="text-sm font-medium text-danger">Last publish failure</p>
                    <p className="mt-1 text-sm text-danger">{publishStatus.publishFailureReason}</p>
                    {publishStatus.publishFailureDetails ? (
                      <pre className="mt-3 max-h-56 overflow-auto rounded-xl bg-foreground p-3 text-xs text-danger">
                        {publishStatus.publishFailureDetails}
                      </pre>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}

            {publishMutation.isError ? (
              <p className="mt-3 text-sm text-danger">{getErrorMessage(publishMutation.error)}</p>
            ) : null}
          </Card>

          {groupId ? (
            <Card>
              <h3 className="text-lg font-semibold text-foreground">Generation Group Review Summary</h3>

              {groupReviewSummaryQuery.isLoading ? (
                <p className="mt-3 text-sm text-muted">Loading group summary...</p>
              ) : groupReviewSummaryQuery.isError || !groupReviewSummaryQuery.data ? (
                <p className="mt-3 text-sm text-danger">Failed to load group summary.</p>
              ) : (
                <>
                  <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    <InfoRow label="Group ID" value={groupReviewSummaryQuery.data.generationGroupId} />
                    <InfoRow label="Total Jobs" value={String(groupReviewSummaryQuery.data.totalJobs)} />
                    <InfoRow label="Selected Job" value={groupReviewSummaryQuery.data.selectedJobId || "-"} />
                  </div>

                  {reviewCountRows.length > 0 ? (
                    <div className="mt-4 grid gap-2 md:grid-cols-4">
                      {reviewCountRows.map(([status, count]) => (
                        <div key={status} className="rounded-xl border border-border bg-surface px-3 py-2">
                          <p className="text-xs text-faint">{status}</p>
                          <p className="mt-1 text-sm text-foreground">{count}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </>
              )}

              {topCandidatesQuery.data && topCandidatesQuery.data.items.length > 0 ? (
                <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-subtle text-muted">
                      <tr>
                        <th className="px-4 py-3 font-medium">Job ID</th>
                        <th className="px-4 py-3 font-medium">Rank</th>
                        <th className="px-4 py-3 font-medium">Score</th>
                        <th className="px-4 py-3 font-medium">Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCandidatesQuery.data.items.map((candidate) => (
                        <tr key={candidate.jobId} className="border-t border-border">
                          <td className="px-4 py-3 text-strong">{candidate.jobId}</td>
                          <td className="px-4 py-3 text-strong">{candidate.topCandidateRank ?? "-"}</td>
                          <td className="px-4 py-3 text-strong">{candidate.rankingScore ?? "-"}</td>
                          <td className="px-4 py-3">
                            <ReviewStatusBadge status={candidate.reviewStatus} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </Card>
          ) : null}

          <Card>
            <h3 className="text-lg font-semibold text-foreground">Generated Metadata</h3>
            <div className="mt-4 space-y-4 text-sm">
              <MetaBlock title="Hook" value={job.hookText} />
              <MetaBlock title="Script" value={job.scriptText} />
              <MetaBlock title="CTA" value={job.ctaText} />
              <MetaBlock title="Caption" value={job.captionText} />
              <MetaBlock title="Hashtags" value={job.hashtags?.length ? job.hashtags.join(" ") : undefined} />
              <MetaBlock title="Resolved Style" value={job.resolvedStyle || undefined} />
              <MetaBlock title="Prompt Template" value={job.promptTemplateId || undefined} />
              <MetaBlock title="Story Angle" value={job.storyAngle} />
              <MetaBlock title="Product Placement Mode" value={job.productPlacementMode} />
              <MetaBlock title="Ad Disclosure Mode" value={job.adDisclosureMode} />
              <MetaBlock title="Character Consistency Mode" value={job.characterConsistencyMode} />
              <MetaBlock title="Scene Breakdown JSON" value={job.sceneBreakdownJson || undefined} isCode />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-foreground">Audio Metadata</h3>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="Audio Mode" value={job.audioGenerationMode || "-"} />
              <InfoRow label="Audio Provider" value={job.audioProvider || "-"} />
              <InfoRow label="Audio Voice ID" value={job.audioVoiceId || "-"} />
              <InfoRow label="Audio Model ID" value={job.audioModelId || "-"} />
              <InfoRow label="Output Format" value={job.audioOutputFormat || "-"} />
              <InfoRow
                label="Provider Duration"
                value={job.audioProviderRequestDurationMs ? `${job.audioProviderRequestDurationMs} ms` : "-"}
              />
              <InfoRow label="Audio Failure Reason" value={job.audioFailureReason || "-"} />
            </div>
            {job.audioFailureDetails ? (
              <pre className="mt-4 max-h-64 overflow-auto rounded-xl border border-border bg-foreground p-3 text-xs text-strong">
                {job.audioFailureDetails}
              </pre>
            ) : null}
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-foreground">Visual Metadata</h3>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
              <InfoRow label="Visual Mode" value={job.visualGenerationMode || "-"} />
              <InfoRow label="Visual Provider" value={job.visualProvider || "-"} />
              <InfoRow label="Visual Model ID" value={job.visualModelId || "-"} />
              <InfoRow label="Visual Failure Reason" value={job.visualFailureReason || "-"} />
            </div>

            {job.visualFailureDetails ? (
              <pre className="mt-4 max-h-64 overflow-auto rounded-xl border border-border bg-foreground p-3 text-xs text-strong">
                {job.visualFailureDetails}
              </pre>
            ) : null}

            {parseSceneAssets(job.sceneAssetsJson).length > 0 ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {parseSceneAssets(job.sceneAssetsJson).map((scene) => (
                  <div key={`scene-${scene.index}-${scene.assetUrl}`} className="rounded-xl border border-border bg-surface p-3">
                    <p className="text-xs text-faint">
                      Scene {scene.index} • {scene.startSec}s - {scene.endSec}s
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {scene.mode || "-"} • {scene.provider || "-"}
                    </p>
                    {scene.assetUrl ? (
                      <a
                        href={scene.assetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block overflow-hidden rounded-xl border border-border bg-foreground"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={scene.assetUrl}
                          alt={`Scene ${scene.index}`}
                          className="h-52 w-full object-cover"
                        />
                      </a>
                    ) : null}
                    {scene.prompt ? (
                      <p className="mt-2 text-xs text-muted">{scene.prompt}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-foreground">Output Assets</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <AssetRow label="Audio URL" url={job.audioUrl} />
              <AssetRow label="Subtitle URL" url={job.subtitleUrl} />
              <AssetRow label="Final Video URL" url={job.finalVideoUrl} />
              <AssetRow label="Download URL" url={job.downloadUrl} />
            </div>

            {job.downloadUrl ? (
              <div className="mt-4">
                <a
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border-strong bg-accent px-4 text-sm font-medium text-on-accent hover:brightness-105"
                  href={job.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download Export
                </a>
              </div>
            ) : null}

            {job.finalVideoUrl ? (
              <div className="mt-5 overflow-hidden rounded-xl border border-border">
                <video controls className="w-full" src={job.finalVideoUrl} />
              </div>
            ) : null}
          </Card>
        </div>
      )}
    </div>
  );
}

function refreshJobData(queryClient: ReturnType<typeof useQueryClient>, jobId: string) {
  queryClient.invalidateQueries({ queryKey: ["jobs", "feed"] });
  queryClient.invalidateQueries({ queryKey: ["jobs", "detail", jobId] });
  queryClient.invalidateQueries({ queryKey: ["jobs", "publish-status", jobId] });
  queryClient.invalidateQueries({ queryKey: ["jobs", "recent"] });
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-faint">{label}</p>
      <p className="mt-1 break-all text-foreground">{value}</p>
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
      <p className="text-xs uppercase tracking-wide text-faint">{title}</p>
      {value ? (
        isCode ? (
          <pre className="mt-2 max-h-64 overflow-auto rounded-xl border border-border bg-foreground p-3 text-xs text-strong">
            {value}
          </pre>
        ) : (
          <p className="mt-1 whitespace-pre-wrap text-strong">{value}</p>
        )
      ) : (
        <p className="mt-1 text-faint">-</p>
      )}
    </div>
  );
}

function AssetRow({ label, url }: { label: string; url?: string | null }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-faint">{label}</p>
      {url ? (
        <a
          className="mt-1 inline-block break-all text-info hover:text-info"
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          {url}
        </a>
      ) : (
        <p className="mt-1 text-faint">Not available yet</p>
      )}
    </div>
  );
}

type ParsedStepErrorDetails = {
  occurredAt?: string;
  step?: string;
  exception?: string;
  rootCauseMessage?: string;
};

function parseStepErrorDetails(details?: string | null): ParsedStepErrorDetails {
  if (!details) {
    return {};
  }

  return details.split("\n").reduce<ParsedStepErrorDetails>((acc, line) => {
    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) {
      return acc;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (!value) {
      return acc;
    }

    if (key === "occurredAt") {
      acc.occurredAt = value;
    }
    if (key === "step") {
      acc.step = value;
    }
    if (key === "exception") {
      acc.exception = value;
    }
    if (key === "rootCauseMessage" || key === "message") {
      acc.rootCauseMessage = acc.rootCauseMessage || value;
    }
    return acc;
  }, {});
}

function getGenerationStepLabel(step?: string | null) {
  switch (step) {
    case "QUEUED":
      return "Queue handoff";
    case "CONTENT_PREPARATION":
    case "SCRIPT_GENERATION":
      return "Script/content generation";
    case "AUDIO_SYNTHESIS":
      return "Audio synthesis";
    case "SUBTITLE_GENERATION":
      return "Subtitle generation";
    case "VISUAL_ASSET_GENERATION":
      return "Visual asset generation";
    case "VIDEO_COMPOSITION":
      return "Video composition";
    case "COMPLETED":
      return "Completion finalization";
    default:
      return "Unknown step";
  }
}

type SceneAssetRow = {
  index: number;
  startSec: number;
  endSec: number;
  prompt?: string | null;
  assetUrl?: string | null;
  mode?: string | null;
  provider?: string | null;
};

function parseSceneAssets(sceneAssetsJson?: string | null): SceneAssetRow[] {
  if (!sceneAssetsJson) {
    return [];
  }
  try {
    const parsed = JSON.parse(sceneAssetsJson);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((item, idx) => ({
        index: Number(item?.index) || idx + 1,
        startSec: Number(item?.startSec) || 0,
        endSec: Number(item?.endSec) || 0,
        prompt: typeof item?.prompt === "string" ? item.prompt : null,
        assetUrl: typeof item?.assetUrl === "string" ? item.assetUrl : null,
        mode: typeof item?.mode === "string" ? item.mode : null,
        provider: typeof item?.provider === "string" ? item.provider : null,
      }))
      .filter((item) => item.assetUrl || item.prompt);
  } catch {
    return [];
  }
}
