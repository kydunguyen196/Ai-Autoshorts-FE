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
  createCharacterProfile,
  deleteCharacterProfile,
  listCharacterProfiles,
  updateCharacterProfile,
} from "@/services/characters-service";
import type { CharacterProfile, CharacterProfileStatus, CharacterProfileUpsertRequest } from "@/types/api";

type ProfileFormState = {
  name: string;
  archetype: string;
  personality: string;
  toneOfVoice: string;
  speakingStyle: string;
  catchphrases: string;
  visualStyle: string;
  language: string;
  targetAudience: string;
  allowedTopics: string;
  forbiddenTopics: string;
  defaultVoiceProvider: string;
  defaultVoiceId: string;
  status: CharacterProfileStatus;
};

const STATUS_OPTIONS: CharacterProfileStatus[] = ["ACTIVE", "INACTIVE", "ARCHIVED"];

export default function CharacterProfilesPage() {
  const queryClient = useQueryClient();
  const { activeChannelId } = useAuth();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileFormState>(emptyForm());

  const profilesQuery = useQuery({
    queryKey: ["characters", "profiles", activeChannelId],
    queryFn: () => listCharacterProfiles(activeChannelId || undefined),
    enabled: Boolean(activeChannelId),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: CharacterProfileUpsertRequest) => {
      if (editingId) {
        return updateCharacterProfile(editingId, payload);
      }
      return createCharacterProfile(payload);
    },
    onSuccess: () => {
      setEditingId(null);
      setForm(emptyForm());
      queryClient.invalidateQueries({ queryKey: ["characters", "profiles"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (profileId: string) => deleteCharacterProfile(profileId),
    onSuccess: () => {
      if (editingId) {
        setEditingId(null);
        setForm(emptyForm());
      }
      queryClient.invalidateQueries({ queryKey: ["characters", "profiles"] });
    },
  });

  const profileCountText = useMemo(() => {
    const count = profilesQuery.data?.length ?? 0;
    return `${count} profile${count === 1 ? "" : "s"}`;
  }, [profilesQuery.data]);

  function applyEdit(profile: CharacterProfile) {
    setEditingId(profile.id);
    setForm({
      name: profile.name,
      archetype: profile.archetype || "",
      personality: profile.personality || "",
      toneOfVoice: profile.toneOfVoice || "",
      speakingStyle: profile.speakingStyle || "",
      catchphrases: profile.catchphrases || "",
      visualStyle: profile.visualStyle || "",
      language: profile.language || "",
      targetAudience: profile.targetAudience || "",
      allowedTopics: profile.allowedTopics || "",
      forbiddenTopics: profile.forbiddenTopics || "",
      defaultVoiceProvider: profile.defaultVoiceProvider || "",
      defaultVoiceId: profile.defaultVoiceId || "",
      status: profile.status,
    });
  }

  function submit() {
    if (!activeChannelId) {
      return;
    }

    saveMutation.mutate({
      channelId: activeChannelId,
      name: form.name.trim(),
      archetype: form.archetype || undefined,
      personality: form.personality || undefined,
      toneOfVoice: form.toneOfVoice || undefined,
      speakingStyle: form.speakingStyle || undefined,
      catchphrases: form.catchphrases || undefined,
      visualStyle: form.visualStyle || undefined,
      language: form.language || undefined,
      targetAudience: form.targetAudience || undefined,
      allowedTopics: form.allowedTopics || undefined,
      forbiddenTopics: form.forbiddenTopics || undefined,
      defaultVoiceProvider: form.defaultVoiceProvider || undefined,
      defaultVoiceId: form.defaultVoiceId || undefined,
      status: form.status,
    });
  }

  return (
    <div>
      <PageHeader
        title="Character Profiles"
        description="Create reusable AI character personas with voice and style defaults."
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-100">
              {editingId ? "Edit Profile" : "Create Profile"}
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
              <span className="text-sm text-zinc-300">Name</span>
              <Input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
                placeholder="Example: Coach Nova"
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Archetype" value={form.archetype} onChange={(value) => setForm((current) => ({ ...current, archetype: value }))} />
              <Field label="Language" value={form.language} onChange={(value) => setForm((current) => ({ ...current, language: value }))} />
              <Field label="Tone Of Voice" value={form.toneOfVoice} onChange={(value) => setForm((current) => ({ ...current, toneOfVoice: value }))} />
              <Field label="Speaking Style" value={form.speakingStyle} onChange={(value) => setForm((current) => ({ ...current, speakingStyle: value }))} />
              <Field label="Voice Provider" value={form.defaultVoiceProvider} onChange={(value) => setForm((current) => ({ ...current, defaultVoiceProvider: value }))} />
              <Field label="Default Voice ID" value={form.defaultVoiceId} onChange={(value) => setForm((current) => ({ ...current, defaultVoiceId: value }))} />
              <Field label="Target Audience" value={form.targetAudience} onChange={(value) => setForm((current) => ({ ...current, targetAudience: value }))} />

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Status</span>
                <Select
                  value={form.status}
                  onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as CharacterProfileStatus }))}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
              </label>
            </div>

            <LongField label="Personality" value={form.personality} onChange={(value) => setForm((current) => ({ ...current, personality: value }))} />
            <LongField label="Visual Style" value={form.visualStyle} onChange={(value) => setForm((current) => ({ ...current, visualStyle: value }))} />
            <LongField label="Catchphrases" value={form.catchphrases} onChange={(value) => setForm((current) => ({ ...current, catchphrases: value }))} />
            <LongField label="Allowed Topics" value={form.allowedTopics} onChange={(value) => setForm((current) => ({ ...current, allowedTopics: value }))} />
            <LongField label="Forbidden Topics" value={form.forbiddenTopics} onChange={(value) => setForm((current) => ({ ...current, forbiddenTopics: value }))} />

            {saveMutation.isError ? (
              <p className="rounded-lg border border-red-700/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {getErrorMessage(saveMutation.error)}
              </p>
            ) : null}

            <Button type="submit" disabled={saveMutation.isPending || !activeChannelId || !form.name.trim()}>
              {saveMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Saving...
                </span>
              ) : editingId ? (
                "Update Profile"
              ) : (
                "Create Profile"
              )}
            </Button>
          </form>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-100">Profiles</h2>
            <p className="text-sm text-zinc-400">{profileCountText}</p>
          </div>

          {!activeChannelId ? (
            <EmptyState
              className="mt-4"
              title="No active channel"
              description="Select an active channel from the top bar to manage character profiles."
            />
          ) : profilesQuery.isLoading ? (
            <p className="mt-4 text-sm text-zinc-400">Loading profiles...</p>
          ) : profilesQuery.isError ? (
            <p className="mt-4 text-sm text-red-300">Failed to load profiles.</p>
          ) : profilesQuery.data && profilesQuery.data.length > 0 ? (
            <div className="mt-4 space-y-3">
              {profilesQuery.data.map((profile) => (
                <div key={profile.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-zinc-100">{profile.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {profile.status} • Updated {formatDateTime(profile.updatedAt)}
                      </p>
                      <p className="mt-2 text-sm text-zinc-300">
                        {profile.archetype || "No archetype"}
                        {profile.defaultVoiceId ? ` • voice ${profile.defaultVoiceId}` : ""}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => applyEdit(profile)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!window.confirm("Delete this profile?")) {
                            return;
                          }
                          deleteMutation.mutate(profile.id);
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
              title="No profiles"
              description="Create your first reusable character persona for story ads."
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

function emptyForm(): ProfileFormState {
  return {
    name: "",
    archetype: "",
    personality: "",
    toneOfVoice: "",
    speakingStyle: "",
    catchphrases: "",
    visualStyle: "",
    language: "",
    targetAudience: "",
    allowedTopics: "",
    forbiddenTopics: "",
    defaultVoiceProvider: "",
    defaultVoiceId: "",
    status: "ACTIVE",
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