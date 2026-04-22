"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/use-auth";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import {
  createCharacterCampaign,
  deleteCharacterCampaign,
  listCharacterCampaigns,
  listCharacterProfiles,
  updateCharacterCampaign,
} from "@/services/characters-service";
import type {
  CharacterCampaign,
  CharacterCampaignStatus,
  CharacterCampaignUpsertRequest,
} from "@/types/api";

type CampaignFormState = {
  productName: string;
  productType: string;
  productDescription: string;
  productUrl: string;
  targetPlatform: string;
  campaignObjective: string;
  callToAction: string;
  targetAudience: string;
  offerSummary: string;
  characterProfileId: string;
  status: CharacterCampaignStatus;
};

const STATUS_OPTIONS: CharacterCampaignStatus[] = ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"];

export default function CharacterCampaignsPage() {
  const queryClient = useQueryClient();
  const { activeChannelId } = useAuth();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CampaignFormState>(emptyForm());

  const campaignsQuery = useQuery({
    queryKey: ["characters", "campaigns", activeChannelId],
    queryFn: () => listCharacterCampaigns(activeChannelId || undefined),
    enabled: Boolean(activeChannelId),
  });

  const profilesQuery = useQuery({
    queryKey: ["characters", "profiles", activeChannelId],
    queryFn: () => listCharacterProfiles(activeChannelId || undefined),
    enabled: Boolean(activeChannelId),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: CharacterCampaignUpsertRequest) => {
      if (editingId) {
        return updateCharacterCampaign(editingId, payload);
      }
      return createCharacterCampaign(payload);
    },
    onSuccess: () => {
      setEditingId(null);
      setForm(emptyForm());
      queryClient.invalidateQueries({ queryKey: ["characters", "campaigns"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (campaignId: string) => deleteCharacterCampaign(campaignId),
    onSuccess: () => {
      if (editingId) {
        setEditingId(null);
        setForm(emptyForm());
      }
      queryClient.invalidateQueries({ queryKey: ["characters", "campaigns"] });
    },
  });

  const campaignCountText = useMemo(() => {
    const count = campaignsQuery.data?.length ?? 0;
    return `${count} campaign${count === 1 ? "" : "s"}`;
  }, [campaignsQuery.data]);

  function applyEdit(campaign: CharacterCampaign) {
    setEditingId(campaign.id);
    setForm({
      productName: campaign.productName,
      productType: campaign.productType || "",
      productDescription: campaign.productDescription || "",
      productUrl: campaign.productUrl || "",
      targetPlatform: campaign.targetPlatform || "",
      campaignObjective: campaign.campaignObjective || "",
      callToAction: campaign.callToAction || "",
      targetAudience: campaign.targetAudience || "",
      offerSummary: campaign.offerSummary || "",
      characterProfileId: campaign.characterProfileId || "",
      status: campaign.status,
    });
  }

  function submit() {
    if (!activeChannelId) {
      return;
    }

    saveMutation.mutate({
      channelId: activeChannelId,
      characterProfileId: form.characterProfileId || undefined,
      productName: form.productName.trim(),
      productType: form.productType || undefined,
      productDescription: form.productDescription || undefined,
      productUrl: form.productUrl || undefined,
      targetPlatform: form.targetPlatform || undefined,
      campaignObjective: form.campaignObjective || undefined,
      callToAction: form.callToAction || undefined,
      targetAudience: form.targetAudience || undefined,
      offerSummary: form.offerSummary || undefined,
      status: form.status,
    });
  }

  return (
    <div>
      <PageHeader
        title="Character Campaigns"
        description="Manage product-focused character campaigns used for story ad generation."
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-100">
              {editingId ? "Edit Campaign" : "Create Campaign"}
            </h2>
            {editingId ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm());
                }}
              >
                Cancel edit
              </Button>
            ) : null}
          </div>

          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Product Name</span>
              <Input
                value={form.productName}
                onChange={(event) => setForm((current) => ({ ...current, productName: event.target.value }))}
                required
                placeholder="Example: FocusFlow App"
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Product Type" value={form.productType} onChange={(value) => setForm((current) => ({ ...current, productType: value }))} />
              <Field label="Target Platform" value={form.targetPlatform} onChange={(value) => setForm((current) => ({ ...current, targetPlatform: value }))} />
              <Field label="Campaign Objective" value={form.campaignObjective} onChange={(value) => setForm((current) => ({ ...current, campaignObjective: value }))} />
              <Field label="Target Audience" value={form.targetAudience} onChange={(value) => setForm((current) => ({ ...current, targetAudience: value }))} />
              <Field label="Product URL" value={form.productUrl} onChange={(value) => setForm((current) => ({ ...current, productUrl: value }))} />

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Character Profile</span>
                <Select
                  value={form.characterProfileId}
                  onChange={(event) => setForm((current) => ({ ...current, characterProfileId: event.target.value }))}
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
                <span className="text-sm text-zinc-300">Status</span>
                <Select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, status: event.target.value as CharacterCampaignStatus }))
                  }
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </label>
            </div>

            <LongField label="Product Description" value={form.productDescription} onChange={(value) => setForm((current) => ({ ...current, productDescription: value }))} />
            <LongField label="Call To Action" value={form.callToAction} onChange={(value) => setForm((current) => ({ ...current, callToAction: value }))} />
            <LongField label="Offer Summary" value={form.offerSummary} onChange={(value) => setForm((current) => ({ ...current, offerSummary: value }))} />

            {saveMutation.isError ? (
              <p className="rounded-lg border border-red-700/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {getErrorMessage(saveMutation.error)}
              </p>
            ) : null}

            <Button type="submit" disabled={saveMutation.isPending || !activeChannelId || !form.productName.trim()}>
              {saveMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Saving...
                </span>
              ) : editingId ? (
                "Update Campaign"
              ) : (
                "Create Campaign"
              )}
            </Button>
          </form>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-100">Campaigns</h2>
            <p className="text-sm text-zinc-400">{campaignCountText}</p>
          </div>

          {!activeChannelId ? (
            <EmptyState
              className="mt-4"
              title="No active channel"
              description="Select an active channel from the top bar to manage campaigns."
            />
          ) : campaignsQuery.isLoading ? (
            <p className="mt-4 text-sm text-zinc-400">Loading campaigns...</p>
          ) : campaignsQuery.isError ? (
            <p className="mt-4 text-sm text-red-300">Failed to load campaigns.</p>
          ) : campaignsQuery.data && campaignsQuery.data.length > 0 ? (
            <div className="mt-4 space-y-3">
              {campaignsQuery.data.map((campaign) => (
                <div key={campaign.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-100">{campaign.productName}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {campaign.status} • Updated {formatDateTime(campaign.updatedAt)}
                      </p>
                      <p className="mt-2 text-sm text-zinc-300">
                        {campaign.targetPlatform || "No platform"}
                        {campaign.characterProfileId ? ` • profile ${campaign.characterProfileId}` : ""}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => applyEdit(campaign)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!window.confirm("Delete this campaign?")) {
                            return;
                          }
                          deleteMutation.mutate(campaign.id);
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-4"
              title="No campaigns"
              description="Create your first campaign to package product context for generation."
            />
          )}

          {deleteMutation.isError ? (
            <p className="mt-4 text-sm text-red-300">{getErrorMessage(deleteMutation.error)}</p>
          ) : null}
        </Card>
      </section>
    </div>
  );
}

function emptyForm(): CampaignFormState {
  return {
    productName: "",
    productType: "",
    productDescription: "",
    productUrl: "",
    targetPlatform: "tiktok",
    campaignObjective: "",
    callToAction: "",
    targetAudience: "",
    offerSummary: "",
    characterProfileId: "",
    status: "DRAFT",
  };
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-zinc-300">{label}</span>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function LongField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-zinc-300">{label}</span>
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-20" />
    </label>
  );
}