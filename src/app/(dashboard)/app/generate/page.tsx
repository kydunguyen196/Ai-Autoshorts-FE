"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/use-auth";
import { useBootstrapMetadata } from "@/hooks/use-bootstrap";
import { getErrorMessage } from "@/lib/utils";
import { listChannels } from "@/services/channels-service";
import { generateVideo } from "@/services/jobs-service";

export default function GeneratePage() {
  const router = useRouter();
  const { activeChannelId } = useAuth();

  const bootstrapQuery = useBootstrapMetadata();
  const channelsQuery = useQuery({
    queryKey: ["channels", "list"],
    queryFn: listChannels,
  });

  const defaults = bootstrapQuery.data?.defaults;
  const styles = bootstrapQuery.data?.supportedStyles ?? ["motivation", "storytelling", "facts", "self-improvement"];

  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState(defaults?.defaultStyle ?? styles[0]);
  const [voiceId, setVoiceId] = useState(defaults?.defaultVoiceId || "");
  const [durationSeconds, setDurationSeconds] = useState(defaults?.defaultDurationSeconds ?? 30);

  const selectedChannelName = useMemo(() => {
    return channelsQuery.data?.find((channel) => channel.id === activeChannelId)?.name ?? "No channel selected";
  }, [channelsQuery.data, activeChannelId]);

  const generateMutation = useMutation({
    mutationFn: () =>
      generateVideo({
        topic,
        style,
        voiceId: voiceId || undefined,
        durationSeconds,
        channelId: activeChannelId || undefined,
      }),
    onSuccess: (job) => {
      router.push(`/app/jobs/${job.jobId}`);
    },
  });

  return (
    <div>
      <PageHeader
        title="Single Generate"
        description="Create one queued video generation job with style, voice, and duration controls."
      />

      <Card className="max-w-3xl">
        <div className="mb-5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100">
          Active channel: <span className="font-medium">{selectedChannelName}</span>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            generateMutation.mutate();
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Topic</span>
            <Textarea
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Example: 3 habits that quietly improve focus"
              required
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Style</span>
              <Select value={style} onChange={(event) => setStyle(event.target.value)}>
                {styles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Voice ID</span>
              <Input
                value={voiceId}
                onChange={(event) => setVoiceId(event.target.value)}
                placeholder="Optional"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Duration (seconds)</span>
              <Input
                type="number"
                min={defaults?.minDurationSeconds ?? 10}
                max={defaults?.maxDurationSeconds ?? 120}
                value={durationSeconds}
                onChange={(event) => setDurationSeconds(Number(event.target.value))}
                required
              />
            </label>
          </div>

          {generateMutation.isError ? (
            <p className="rounded-lg border border-red-700/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {getErrorMessage(generateMutation.error, "Failed to submit generation")}
            </p>
          ) : null}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={generateMutation.isPending || !activeChannelId}>
              {generateMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Submitting...
                </span>
              ) : (
                "Queue Generation"
              )}
            </Button>
            {!activeChannelId ? (
              <p className="text-sm text-amber-200">Select an active channel in the top bar first.</p>
            ) : null}
          </div>
        </form>
      </Card>
    </div>
  );
}
