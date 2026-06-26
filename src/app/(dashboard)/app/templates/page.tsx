"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { getErrorMessage } from "@/lib/utils";
import {
  createTemplate,
  deleteTemplate,
  listTemplates,
} from "@/services/templates-service";
import type { VideoTemplate } from "@/types/api";

const CAPTION_POSITIONS = ["TOP", "CENTER", "BOTTOM"];

const EMPTY_FORM = {
  name: "",
  description: "",
  captionPosition: "BOTTOM",
  fontFamily: "",
  primaryColor: "#ffffff",
  accentColor: "#22d3ee",
  makeDefault: false,
};

export default function TemplatesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const templatesQuery = useQuery({
    queryKey: ["templates"],
    queryFn: listTemplates,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createTemplate({
        name: form.name.trim(),
        description: form.description || undefined,
        captionPosition: form.captionPosition,
        fontFamily: form.fontFamily || undefined,
        primaryColor: form.primaryColor || undefined,
        accentColor: form.accentColor || undefined,
        makeDefault: form.makeDefault,
      }),
    onSuccess: () => {
      setForm({ ...EMPTY_FORM });
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (templateId: string) => deleteTemplate(templateId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });

  const templates = templatesQuery.data ?? [];

  return (
    <div>
      <PageHeader
        title="Templates"
        description="Reusable caption layout & styling presets applied during video composition."
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-foreground">New template</h2>
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              createMutation.mutate();
            }}
          >
            <Field
              label="Name"
              value={form.name}
              onChange={(value) => setForm((current) => ({ ...current, name: value }))}
            />
            <Field
              label="Description"
              value={form.description}
              onChange={(value) => setForm((current) => ({ ...current, description: value }))}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm text-strong">Caption position</span>
                <Select
                  value={form.captionPosition}
                  onChange={(event) => setForm((current) => ({ ...current, captionPosition: event.target.value }))}
                >
                  {CAPTION_POSITIONS.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </Select>
              </label>
              <Field
                label="Font family"
                value={form.fontFamily}
                onChange={(value) => setForm((current) => ({ ...current, fontFamily: value }))}
              />
              <Field
                label="Primary color"
                value={form.primaryColor}
                onChange={(value) => setForm((current) => ({ ...current, primaryColor: value }))}
              />
              <Field
                label="Accent color"
                value={form.accentColor}
                onChange={(value) => setForm((current) => ({ ...current, accentColor: value }))}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-strong">
              <input
                type="checkbox"
                checked={form.makeDefault}
                onChange={(event) => setForm((current) => ({ ...current, makeDefault: event.target.checked }))}
              />
              Set as default template
            </label>

            {createMutation.isError ? (
              <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                {getErrorMessage(createMutation.error)}
              </p>
            ) : null}

            <Button type="submit" disabled={createMutation.isPending || !form.name.trim()}>
              {createMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Saving...
                </span>
              ) : (
                "Create template"
              )}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-foreground">Your templates</h2>
          {templatesQuery.isLoading ? (
            <p className="mt-4 text-sm text-muted">Loading templates...</p>
          ) : templates.length === 0 ? (
            <EmptyState className="mt-4" title="No templates" description="Create your first template." />
          ) : (
            <ul className="mt-4 space-y-3">
              {templates.map((template) => (
                <TemplateRow
                  key={template.id}
                  template={template}
                  onDelete={() => deleteMutation.mutate(template.id)}
                  deleting={deleteMutation.isPending}
                />
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}

function TemplateRow({
  template,
  onDelete,
  deleting,
}: {
  template: VideoTemplate;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <li className="rounded-xl border border-border bg-surface px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-foreground">
            {template.name}
            {template.default ? (
              <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-xs text-accent">default</span>
            ) : null}
          </p>
          {template.description ? <p className="mt-1 text-sm text-muted">{template.description}</p> : null}
          <p className="mt-1 text-xs text-faint">
            caption {template.captionPosition}
            {template.fontFamily ? ` · ${template.fontFamily}` : ""}
            {template.primaryColor ? ` · ${template.primaryColor}` : ""}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete} disabled={deleting}>
          Delete
        </Button>
      </div>
    </li>
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
