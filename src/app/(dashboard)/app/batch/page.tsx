"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/use-auth";
import { useBootstrapMetadata } from "@/hooks/use-bootstrap";
import { getErrorMessage } from "@/lib/utils";
import { listCharacterCampaigns, listCharacterProfiles } from "@/services/characters-service";
import { batchGenerate } from "@/services/jobs-service";
import type { BatchGenerateItemRequest, BatchGenerateResponse } from "@/types/api";

type BatchItemState = {
  id: string;
  topic: string;
  style: string;
  contentStyle: string;
  voiceId: string;
  durationSeconds: string;
  variantCount: string;
  characterProfileId: string;
  characterCampaignId: string;
  storyAngle: string;
  productPlacementMode: string;
  adDisclosureMode: string;
  sceneCountTarget: string;
  characterConsistencyMode: string;
};

export default function BatchGeneratePage() {
  const { activeChannelId } = useAuth();
  const bootstrapQuery = useBootstrapMetadata();

  const styles = bootstrapQuery.data?.supportedStyles ?? ["motivation", "storytelling", "facts", "self-improvement"];
  const defaults = bootstrapQuery.data?.defaults;

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

  const [defaultStyle, setDefaultStyle] = useState(defaults?.defaultStyle ?? styles[0]);
  const [defaultContentStyle, setDefaultContentStyle] = useState("");
  const [defaultVoiceId, setDefaultVoiceId] = useState(defaults?.defaultVoiceId || "");
  const [defaultDurationSeconds, setDefaultDurationSeconds] = useState(defaults?.defaultDurationSeconds ?? 30);
  const [defaultVariantCount, setDefaultVariantCount] = useState(1);
  const [defaultCharacterProfileId, setDefaultCharacterProfileId] = useState("");
  const [defaultCharacterCampaignId, setDefaultCharacterCampaignId] = useState("");
  const [defaultStoryAngle, setDefaultStoryAngle] = useState("");
  const [defaultProductPlacementMode, setDefaultProductPlacementMode] = useState("");
  const [defaultAdDisclosureMode, setDefaultAdDisclosureMode] = useState("");
  const [defaultSceneCountTarget, setDefaultSceneCountTarget] = useState("");
  const [defaultCharacterConsistencyMode, setDefaultCharacterConsistencyMode] = useState("");

  const [items, setItems] = useState<BatchItemState[]>([createEmptyItem()]);
  const [result, setResult] = useState<BatchGenerateResponse | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: BatchGenerateItemRequest[]) =>
      batchGenerate({
        defaultStyle,
        defaultContentStyle: defaultContentStyle || undefined,
        defaultVoiceId: defaultVoiceId || undefined,
        defaultChannelId: activeChannelId || undefined,
        defaultDurationSeconds,
        defaultVariantCount,
        defaultCharacterProfileId: defaultCharacterProfileId || undefined,
        defaultCharacterCampaignId: defaultCharacterCampaignId || undefined,
        defaultStoryAngle: defaultStoryAngle || undefined,
        defaultProductPlacementMode: defaultProductPlacementMode || undefined,
        defaultAdDisclosureMode: defaultAdDisclosureMode || undefined,
        defaultSceneCountTarget: parseOptionalInt(defaultSceneCountTarget),
        defaultCharacterConsistencyMode: defaultCharacterConsistencyMode || undefined,
        items: payload,
      }),
    onSuccess: (response) => {
      setResult(response);
    },
  });

  const validItems = useMemo(() => items.filter((item) => item.topic.trim().length > 0), [items]);

  function updateItem(id: string, patch: Partial<BatchItemState>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addItem() {
    setItems((current) => [...current, createEmptyItem()]);
  }

  function removeItem(id: string) {
    setItems((current) => (current.length <= 1 ? current : current.filter((item) => item.id !== id)));
  }

  function toPayloadItem(item: BatchItemState): BatchGenerateItemRequest {
    return {
      topic: item.topic.trim(),
      style: item.style || undefined,
      contentStyle: item.contentStyle || undefined,
      durationSeconds: parseOptionalInt(item.durationSeconds),
      voiceId: item.voiceId || undefined,
      variantCount: parseOptionalInt(item.variantCount),
      characterProfileId: item.characterProfileId || undefined,
      characterCampaignId: item.characterCampaignId || undefined,
      storyAngle: item.storyAngle || undefined,
      productPlacementMode: item.productPlacementMode || undefined,
      adDisclosureMode: item.adDisclosureMode || undefined,
      sceneCountTarget: parseOptionalInt(item.sceneCountTarget),
      characterConsistencyMode: item.characterConsistencyMode || undefined,
    };
  }

  return (
    <div>
      <PageHeader
        title="Batch Generate"
        description="Submit multiple jobs with shared defaults and per-item character/story overrides."
      />

      <Card>
        <h2 className="text-lg font-semibold text-zinc-100">Batch Defaults</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <label className="block space-y-2 md:col-span-2">
            <span className="text-sm text-zinc-300">Default Style</span>
            <Select value={defaultStyle} onChange={(event) => setDefaultStyle(event.target.value)}>
              {styles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </Select>
          </label>

          <label className="block space-y-2 md:col-span-2">
            <span className="text-sm text-zinc-300">Default Content Style</span>
            <Input
              value={defaultContentStyle}
              onChange={(event) => setDefaultContentStyle(event.target.value)}
              placeholder="Optional"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Default Voice ID</span>
            <Input
              value={defaultVoiceId}
              onChange={(event) => setDefaultVoiceId(event.target.value)}
              placeholder="Optional"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Default Duration</span>
            <Input
              type="number"
              min={defaults?.minDurationSeconds ?? 10}
              max={defaults?.maxDurationSeconds ?? 120}
              value={defaultDurationSeconds}
              onChange={(event) => setDefaultDurationSeconds(Number(event.target.value))}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Default Variant Count</span>
            <Input
              type="number"
              min={1}
              max={10}
              value={defaultVariantCount}
              onChange={(event) => setDefaultVariantCount(Number(event.target.value))}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Default Scene Count</span>
            <Input
              type="number"
              min={1}
              max={20}
              value={defaultSceneCountTarget}
              onChange={(event) => setDefaultSceneCountTarget(event.target.value)}
              placeholder="Optional"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Default Character Profile</span>
            <Select
              value={defaultCharacterProfileId}
              onChange={(event) => setDefaultCharacterProfileId(event.target.value)}
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
            <span className="text-sm text-zinc-300">Default Campaign</span>
            <Select
              value={defaultCharacterCampaignId}
              onChange={(event) => setDefaultCharacterCampaignId(event.target.value)}
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
            <span className="text-sm text-zinc-300">Default Story Angle</span>
            <Input
              value={defaultStoryAngle}
              onChange={(event) => setDefaultStoryAngle(event.target.value)}
              placeholder="Optional"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Default Product Placement</span>
            <Input
              value={defaultProductPlacementMode}
              onChange={(event) => setDefaultProductPlacementMode(event.target.value)}
              placeholder="Optional"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-zinc-300">Default Ad Disclosure</span>
            <Input
              value={defaultAdDisclosureMode}
              onChange={(event) => setDefaultAdDisclosureMode(event.target.value)}
              placeholder="Optional"
            />
          </label>

          <label className="block space-y-2 md:col-span-4">
            <span className="text-sm text-zinc-300">Default Character Consistency Mode</span>
            <Input
              value={defaultCharacterConsistencyMode}
              onChange={(event) => setDefaultCharacterConsistencyMode(event.target.value)}
              placeholder="Optional"
            />
          </label>
        </div>

        <p className="mt-4 text-xs text-zinc-500">Per-item fields below can override these defaults.</p>
      </Card>

      <Card className="mt-6">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-100">Item {index + 1}</p>
                <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                  Remove
                </Button>
              </div>

              <div className="grid gap-3">
                <Input
                  value={item.topic}
                  onChange={(event) => updateItem(item.id, { topic: event.target.value })}
                  placeholder="Topic"
                />

                <div className="grid gap-3 md:grid-cols-4">
                  <Select
                    value={item.style}
                    onChange={(event) => updateItem(item.id, { style: event.target.value })}
                  >
                    <option value="">Use default style</option>
                    {styles.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </Select>

                  <Input
                    value={item.contentStyle}
                    onChange={(event) => updateItem(item.id, { contentStyle: event.target.value })}
                    placeholder="Content style override"
                  />

                  <Input
                    type="number"
                    min={defaults?.minDurationSeconds ?? 10}
                    max={defaults?.maxDurationSeconds ?? 120}
                    value={item.durationSeconds}
                    onChange={(event) => updateItem(item.id, { durationSeconds: event.target.value })}
                    placeholder="Duration override"
                  />

                  <Input
                    value={item.voiceId}
                    onChange={(event) => updateItem(item.id, { voiceId: event.target.value })}
                    placeholder="Voice ID override"
                  />

                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={item.variantCount}
                    onChange={(event) => updateItem(item.id, { variantCount: event.target.value })}
                    placeholder="Variant count override"
                  />

                  <Select
                    value={item.characterProfileId}
                    onChange={(event) => updateItem(item.id, { characterProfileId: event.target.value })}
                    disabled={!activeChannelId || profilesQuery.isLoading}
                  >
                    <option value="">Use default profile</option>
                    {(profilesQuery.data ?? []).map((profile) => (
                      <option key={profile.id} value={profile.id}>
                        {profile.name}
                      </option>
                    ))}
                  </Select>

                  <Select
                    value={item.characterCampaignId}
                    onChange={(event) => updateItem(item.id, { characterCampaignId: event.target.value })}
                    disabled={!activeChannelId || campaignsQuery.isLoading}
                  >
                    <option value="">Use default campaign</option>
                    {(campaignsQuery.data ?? []).map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.productName}
                      </option>
                    ))}
                  </Select>

                  <Input
                    value={item.sceneCountTarget}
                    onChange={(event) => updateItem(item.id, { sceneCountTarget: event.target.value })}
                    placeholder="Scene count override"
                  />

                  <Input
                    value={item.storyAngle}
                    onChange={(event) => updateItem(item.id, { storyAngle: event.target.value })}
                    placeholder="Story angle override"
                  />

                  <Input
                    value={item.productPlacementMode}
                    onChange={(event) => updateItem(item.id, { productPlacementMode: event.target.value })}
                    placeholder="Product placement mode"
                  />

                  <Input
                    value={item.adDisclosureMode}
                    onChange={(event) => updateItem(item.id, { adDisclosureMode: event.target.value })}
                    placeholder="Ad disclosure mode"
                  />

                  <Input
                    value={item.characterConsistencyMode}
                    onChange={(event) =>
                      updateItem(item.id, { characterConsistencyMode: event.target.value })
                    }
                    placeholder="Character consistency mode"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={addItem}>
            Add Item
          </Button>
          <Button
            onClick={() => mutation.mutate(validItems.map(toPayloadItem))}
            disabled={mutation.isPending || validItems.length === 0 || !activeChannelId}
          >
            {mutation.isPending ? (
              <span className="flex items-center gap-2">
                <Spinner /> Submitting batch...
              </span>
            ) : (
              "Submit Batch"
            )}
          </Button>
        </div>

        {mutation.isError ? (
          <p className="mt-4 rounded-lg border border-red-700/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {getErrorMessage(mutation.error)}
          </p>
        ) : null}

        {!activeChannelId ? (
          <p className="mt-4 text-sm text-amber-200">Please select an active channel in the top bar.</p>
        ) : null}
      </Card>

      {result ? (
        <Card className="mt-6">
          <h2 className="text-lg font-semibold text-zinc-100">Batch Summary</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Batch {result.batchId} - accepted {result.totalAccepted}/{result.totalRequested} requests
            {result.totalVariantsRequested ? ` (${result.totalVariantsRequested} variants requested)` : ""}
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-900/60 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Topic</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Group</th>
                  <th className="px-4 py-3 font-medium">Variant</th>
                  <th className="px-4 py-3 font-medium">Job</th>
                  <th className="px-4 py-3 font-medium">Message</th>
                </tr>
              </thead>
              <tbody>
                {result.jobs.map((job, index) => (
                  <tr key={`${job.jobId ?? "no-job"}-${index}`} className="border-t border-zinc-800/80">
                    <td className="px-4 py-3 text-zinc-100">{job.topic || "-"}</td>
                    <td className="px-4 py-3 text-zinc-300">{job.status || "SKIPPED"}</td>
                    <td className="px-4 py-3 text-zinc-400">{job.generationGroupId || "-"}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      {job.variantIndex && job.variantCount
                        ? `${job.variantIndex}/${job.variantCount}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {job.jobId ? (
                        <Link className="text-indigo-300 hover:text-indigo-200" href={`/app/jobs/${job.jobId}`}>
                          {job.jobId}
                        </Link>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{job.errorMessage || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function createEmptyItem(): BatchItemState {
  return {
    id: crypto.randomUUID(),
    topic: "",
    style: "",
    contentStyle: "",
    voiceId: "",
    durationSeconds: "",
    variantCount: "",
    characterProfileId: "",
    characterCampaignId: "",
    storyAngle: "",
    productPlacementMode: "",
    adDisclosureMode: "",
    sceneCountTarget: "",
    characterConsistencyMode: "",
  };
}

function parseOptionalInt(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}