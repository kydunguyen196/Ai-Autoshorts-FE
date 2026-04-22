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
import { listCharacterCampaigns, listCharacterProfiles } from "@/services/characters-service";
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

  const profilesQuery = useQuery({
    queryKey: ["characters", "profiles", activeChannelId],
    queryFn: () => listCharacterProfiles(activeChannelId || undefined),
    enabled: Boolean(activeChannelId),
  });

  const campaignsQuery = useQuery({
    queryKey: ["characters", "campaigns", activeChannelId],
    queryFn: () => listCharacterCampaigns(activeChannelId || undefined),
    enabled: Boolean(activeChannelId),
  });

  const defaults = bootstrapQuery.data?.defaults;
  const styles = bootstrapQuery.data?.supportedStyles ?? ["motivation", "storytelling", "facts", "self-improvement"];

  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState(defaults?.defaultStyle ?? styles[0]);
  const [contentStyle, setContentStyle] = useState("");
  const [voiceId, setVoiceId] = useState(defaults?.defaultVoiceId || "");
  const [durationSeconds, setDurationSeconds] = useState(defaults?.defaultDurationSeconds ?? 30);
  const [variantCount, setVariantCount] = useState(1);

  const [characterProfileId, setCharacterProfileId] = useState("");
  const [characterCampaignId, setCharacterCampaignId] = useState("");
  const [storyAngle, setStoryAngle] = useState("");
  const [productPlacementMode, setProductPlacementMode] = useState("");
  const [adDisclosureMode, setAdDisclosureMode] = useState("");
  const [sceneCountTarget, setSceneCountTarget] = useState("");
  const [characterConsistencyMode, setCharacterConsistencyMode] = useState("");

  const selectedChannelName = useMemo(() => {
    return channelsQuery.data?.find((channel) => channel.id === activeChannelId)?.name ?? "No channel selected";
  }, [channelsQuery.data, activeChannelId]);

  const generateMutation = useMutation({
    mutationFn: () =>
      generateVideo({
        topic,
        style,
        contentStyle: contentStyle || undefined,
        voiceId: voiceId || undefined,
        durationSeconds,
        channelId: activeChannelId || undefined,
        variantCount,
        characterProfileId: characterProfileId || undefined,
        characterCampaignId: characterCampaignId || undefined,
        storyAngle: storyAngle || undefined,
        productPlacementMode: productPlacementMode || undefined,
        adDisclosureMode: adDisclosureMode || undefined,
        sceneCountTarget: parseOptionalInt(sceneCountTarget),
        characterConsistencyMode: characterConsistencyMode || undefined,
      }),
    onSuccess: (job) => {
      router.push(`/app/jobs/${job.jobId}`);
    },
  });

  return (
    <div>
      <PageHeader
        title="Single Generate"
        description="Create one queued video generation job with optional character story-ad metadata."
      />

      <Card className="max-w-5xl">
        <div className="mb-5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100">
          Active channel: <span className="font-medium">{selectedChannelName}</span>
        </div>

        <form
          className="space-y-5"
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
              placeholder="Example: A day-in-the-life story ad for a productivity app"
              required
            />
          </label>

          <div className="grid gap-4 md:grid-cols-5">
            <label className="block space-y-2 md:col-span-2">
              <span className="text-sm text-zinc-300">Style</span>
              <Select value={style} onChange={(event) => setStyle(event.target.value)}>
                {styles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </label>

            <label className="block space-y-2 md:col-span-3">
              <span className="text-sm text-zinc-300">Content Style (optional override)</span>
              <Input
                value={contentStyle}
                onChange={(event) => setContentStyle(event.target.value)}
                placeholder="Optional"
              />
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

            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Variant Count</span>
              <Input
                type="number"
                min={1}
                max={10}
                value={variantCount}
                onChange={(event) => setVariantCount(Number(event.target.value))}
                required
              />
            </label>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Character Story Ads Inputs</h3>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Character Profile</span>
                <Select
                  value={characterProfileId}
                  onChange={(event) => setCharacterProfileId(event.target.value)}
                  disabled={!activeChannelId || profilesQuery.isLoading}
                >
                  <option value="">None</option>
                  {(profilesQuery.data ?? []).map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </Select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Character Campaign</span>
                <Select
                  value={characterCampaignId}
                  onChange={(event) => setCharacterCampaignId(event.target.value)}
                  disabled={!activeChannelId || campaignsQuery.isLoading}
                >
                  <option value="">None</option>
                  {(campaignsQuery.data ?? []).map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.productName}
                    </option>
                  ))}
                </Select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Story Angle</span>
                <Input
                  value={storyAngle}
                  onChange={(event) => setStoryAngle(event.target.value)}
                  placeholder="Example: before-after transformation"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Product Placement Mode</span>
                <Input
                  value={productPlacementMode}
                  onChange={(event) => setProductPlacementMode(event.target.value)}
                  placeholder="Example: soft_mention"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Ad Disclosure Mode</span>
                <Input
                  value={adDisclosureMode}
                  onChange={(event) => setAdDisclosureMode(event.target.value)}
                  placeholder="Example: declared_by_brand"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Scene Count Target</span>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={sceneCountTarget}
                  onChange={(event) => setSceneCountTarget(event.target.value)}
                  placeholder="Optional"
                />
              </label>

              <label className="block space-y-2 md:col-span-2">
                <span className="text-sm text-zinc-300">Character Consistency Mode</span>
                <Input
                  value={characterConsistencyMode}
                  onChange={(event) => setCharacterConsistencyMode(event.target.value)}
                  placeholder="Example: strict_voice_and_persona"
                />
              </label>
            </div>

            {profilesQuery.isError ? (
              <p className="mt-3 text-xs text-amber-200">Could not load character profiles for this channel.</p>
            ) : null}
            {campaignsQuery.isError ? (
              <p className="mt-2 text-xs text-amber-200">Could not load campaigns for this channel.</p>
            ) : null}
          </div>

          {generateMutation.isError ? (
            <p className="rounded-lg border border-red-700/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {getErrorMessage(generateMutation.error, "Failed to submit generation")}
            </p>
          ) : null}

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={generateMutation.isPending || !activeChannelId || !topic.trim()}
            >
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

function parseOptionalInt(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}