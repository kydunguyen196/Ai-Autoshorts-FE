"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/utils";
import { updateChannelBrandKit } from "@/services/channels-service";
import type { Channel } from "@/types/api";

/** Phase 5 brand kit editor for a channel: logo, colors, intro/outro clips. */
export function BrandKitEditor({ channel }: { channel: Channel }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    brandLogoUrl: channel.brandLogoUrl ?? "",
    brandPrimaryColor: channel.brandPrimaryColor ?? "",
    brandAccentColor: channel.brandAccentColor ?? "",
    brandIntroUrl: channel.brandIntroUrl ?? "",
    brandOutroUrl: channel.brandOutroUrl ?? "",
  });
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: () =>
      updateChannelBrandKit(channel.id, {
        brandLogoUrl: form.brandLogoUrl || undefined,
        brandPrimaryColor: form.brandPrimaryColor || undefined,
        brandAccentColor: form.brandAccentColor || undefined,
        brandIntroUrl: form.brandIntroUrl || undefined,
        brandOutroUrl: form.brandOutroUrl || undefined,
      }),
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-foreground">Brand kit — {channel.name}</h2>
      <p className="mt-1 text-sm text-muted">
        Logo, colors and intro/outro applied to videos for the active channel.
      </p>

      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate();
        }}
      >
        <Field label="Logo URL" value={form.brandLogoUrl} onChange={(v) => update("brandLogoUrl", v)} />
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Primary color" value={form.brandPrimaryColor} onChange={(v) => update("brandPrimaryColor", v)} />
          <Field label="Accent color" value={form.brandAccentColor} onChange={(v) => update("brandAccentColor", v)} />
        </div>
        <Field label="Intro clip URL" value={form.brandIntroUrl} onChange={(v) => update("brandIntroUrl", v)} />
        <Field label="Outro clip URL" value={form.brandOutroUrl} onChange={(v) => update("brandOutroUrl", v)} />

        {mutation.isError ? (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {getErrorMessage(mutation.error)}
          </p>
        ) : null}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <span className="flex items-center gap-2">
                <Spinner /> Saving...
              </span>
            ) : (
              "Save brand kit"
            )}
          </Button>
          {saved ? <span className="text-sm text-muted">Saved.</span> : null}
        </div>
      </form>
    </Card>
  );
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
      <span className="text-sm text-strong">{label}</span>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
