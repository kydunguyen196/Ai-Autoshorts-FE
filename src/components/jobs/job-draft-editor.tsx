"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/utils";
import { finalizeJobDraft, updateJobDraft } from "@/services/jobs-service";
import type { VideoJob } from "@/types/api";

/**
 * Phase 5 editor: shown while a job is AWAITING_REVIEW. Lets the user edit the draft
 * (script, caption, voice) before finalizing the render.
 */
export function JobDraftEditor({ job }: { job: VideoJob }) {
  const queryClient = useQueryClient();
  const [scriptText, setScriptText] = useState(job.scriptText ?? "");
  const [captionText, setCaptionText] = useState(job.captionText ?? "");
  const [voiceId, setVoiceId] = useState(job.voiceId ?? "");
  const [saved, setSaved] = useState(false);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["jobs", "detail", job.jobId] });
    queryClient.invalidateQueries({ queryKey: ["jobs", "feed"] });
  }

  const saveMutation = useMutation({
    mutationFn: () =>
      updateJobDraft(job.jobId, {
        scriptText: scriptText.trim() || undefined,
        captionText: captionText.trim() || undefined,
        voiceId: voiceId.trim() || undefined,
      }),
    onSuccess: () => {
      setSaved(true);
      invalidate();
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: () => finalizeJobDraft(job.jobId),
    onSuccess: () => invalidate(),
  });

  if (job.status !== "AWAITING_REVIEW") {
    return null;
  }

  return (
    <Card className="border-accent/40">
      <h2 className="text-lg font-semibold text-foreground">Review &amp; edit draft</h2>
      <p className="mt-1 text-sm text-muted">
        The script is generated and waiting for your review. Edit it, then finalize to render the video.
      </p>

      <div className="mt-4 space-y-3">
        <label className="block space-y-2">
          <span className="text-sm text-strong">Script</span>
          <textarea
            className="min-h-[180px] w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground"
            value={scriptText}
            onChange={(event) => {
              setScriptText(event.target.value);
              setSaved(false);
            }}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-strong">Caption</span>
          <Input
            value={captionText}
            onChange={(event) => {
              setCaptionText(event.target.value);
              setSaved(false);
            }}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-strong">Voice ID (optional)</span>
          <Input
            value={voiceId}
            onChange={(event) => {
              setVoiceId(event.target.value);
              setSaved(false);
            }}
          />
        </label>

        {saveMutation.isError ? (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {getErrorMessage(saveMutation.error)}
          </p>
        ) : null}
        {finalizeMutation.isError ? (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {getErrorMessage(finalizeMutation.error)}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Spinner /> Saving...
              </span>
            ) : (
              "Save draft"
            )}
          </Button>
          <Button onClick={() => finalizeMutation.mutate()} disabled={finalizeMutation.isPending}>
            {finalizeMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Spinner /> Finalizing...
              </span>
            ) : (
              "Finalize & render"
            )}
          </Button>
          {saved ? <span className="text-sm text-muted">Draft saved.</span> : null}
        </div>
      </div>
    </Card>
  );
}
