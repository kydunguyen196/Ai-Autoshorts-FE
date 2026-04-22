"use client";

import { useState, type SetStateAction } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/use-auth";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import { getTikTokConnectionStatus, upsertTikTokConnection } from "@/services/tiktok-service";
import type { TikTokConnectionStatus, TikTokConnectionStatusResponse } from "@/types/api";

type ConnectionFormState = {
  platformAccountId: string;
  platformUsername: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: string;
  scopesCsv: string;
  status: TikTokConnectionStatus;
};

const STATUS_OPTIONS: TikTokConnectionStatus[] = ["PENDING", "ACTIVE", "EXPIRED", "REVOKED", "ERROR"];

export default function TikTokIntegrationPage() {
  const queryClient = useQueryClient();
  const { activeChannelId } = useAuth();

  const [draftForm, setDraftForm] = useState<ConnectionFormState | null>(null);

  const connectionQuery = useQuery({
    queryKey: ["integrations", "tiktok", "connection", activeChannelId],
    queryFn: () => getTikTokConnectionStatus(activeChannelId || undefined),
    enabled: Boolean(activeChannelId),
  });

  const connection = connectionQuery.data;

  const form = draftForm ?? connectionToForm(connection);

  function setForm(update: SetStateAction<ConnectionFormState>) {
    setDraftForm((current) => {
      const base = current ?? connectionToForm(connection);
      return typeof update === "function"
        ? (update as (previousState: ConnectionFormState) => ConnectionFormState)(base)
        : update;
    });
  }

  const upsertMutation = useMutation({
    mutationFn: () =>
      upsertTikTokConnection({
        channelId: activeChannelId || undefined,
        platformAccountId: form.platformAccountId || undefined,
        platformUsername: form.platformUsername || undefined,
        accessToken: form.accessToken || undefined,
        refreshToken: form.refreshToken || undefined,
        tokenExpiresAt: parseDateTimeLocal(form.tokenExpiresAt),
        scopes: parseScopes(form.scopesCsv),
        status: form.status,
      }),
    onSuccess: (response) => {
      setDraftForm(connectionToForm(response));
      queryClient.invalidateQueries({ queryKey: ["integrations", "tiktok", "connection"] });
    },
  });

  return (
    <div>
      <PageHeader
        title="TikTok Connection"
        description="Manage channel-level TikTok account metadata required for publish readiness."
      />

      {!activeChannelId ? (
        <Card>
          <EmptyState
            title="No active channel"
            description="Select an active channel from the top bar to manage TikTok connection."
          />
        </Card>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          <Card>
            <h2 className="text-lg font-semibold text-zinc-100">Connection Settings</h2>
            <p className="mt-2 text-sm text-zinc-400">
              This form stores connection metadata in backend. Real OAuth exchange can be plugged in later.
            </p>

            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDraftForm(null)}
                disabled={upsertMutation.isPending}
              >
                Reset to server values
              </Button>
            </div>

            <form
              className="mt-4 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                upsertMutation.mutate();
              }}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  label="Platform Account ID"
                  value={form.platformAccountId}
                  onChange={(value) => setForm((current) => ({ ...current, platformAccountId: value }))}
                />

                <Field
                  label="Platform Username"
                  value={form.platformUsername}
                  onChange={(value) => setForm((current) => ({ ...current, platformUsername: value }))}
                />

                <label className="block space-y-2">
                  <span className="text-sm text-zinc-300">Token Expires At</span>
                  <Input
                    type="datetime-local"
                    value={form.tokenExpiresAt}
                    onChange={(event) => setForm((current) => ({ ...current, tokenExpiresAt: event.target.value }))}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm text-zinc-300">Status</span>
                  <Select
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, status: event.target.value as TikTokConnectionStatus }))
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

              <Field
                label="Scopes (comma separated)"
                value={form.scopesCsv}
                onChange={(value) => setForm((current) => ({ ...current, scopesCsv: value }))}
              />

              <Field
                label="Access Token (optional update)"
                value={form.accessToken}
                onChange={(value) => setForm((current) => ({ ...current, accessToken: value }))}
              />

              <Field
                label="Refresh Token (optional update)"
                value={form.refreshToken}
                onChange={(value) => setForm((current) => ({ ...current, refreshToken: value }))}
              />

              {upsertMutation.isError ? (
                <p className="rounded-lg border border-red-700/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {getErrorMessage(upsertMutation.error)}
                </p>
              ) : null}

              <Button type="submit" disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner /> Saving...
                  </span>
                ) : (
                  "Save Connection"
                )}
              </Button>
            </form>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-zinc-100">Current Status</h2>

            {connectionQuery.isLoading ? (
              <p className="mt-4 text-sm text-zinc-400">Loading connection status...</p>
            ) : connectionQuery.isError ? (
              <p className="mt-4 text-sm text-red-300">Failed to load connection status.</p>
            ) : connection ? (
              <ConnectionSummary connection={connection} />
            ) : (
              <EmptyState
                className="mt-4"
                title="No data"
                description="No connection record was returned for this channel."
              />
            )}
          </Card>
        </section>
      )}
    </div>
  );
}

function ConnectionSummary({ connection }: { connection: TikTokConnectionStatusResponse }) {
  return (
    <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
      <InfoRow label="Status" value={connection.status} />
      <InfoRow label="Active" value={connection.active ? "Yes" : "No"} />
      <InfoRow label="Channel" value={connection.channelId} />
      <InfoRow label="Platform Account ID" value={connection.platformAccountId || "-"} />
      <InfoRow label="Platform Username" value={connection.platformUsername || "-"} />
      <InfoRow label="Scopes" value={connection.scopes?.length ? connection.scopes.join(", ") : "-"} />
      <InfoRow label="Token Expires At" value={formatDateTime(connection.tokenExpiresAt)} />
      <InfoRow label="Last Sync" value={formatDateTime(connection.lastSyncAt)} />
      <InfoRow label="Created At" value={formatDateTime(connection.createdAt)} />
      <InfoRow label="Updated At" value={formatDateTime(connection.updatedAt)} />
    </div>
  );
}

function emptyForm(): ConnectionFormState {
  return {
    platformAccountId: "",
    platformUsername: "",
    accessToken: "",
    refreshToken: "",
    tokenExpiresAt: "",
    scopesCsv: "",
    status: "ACTIVE",
  };
}

function connectionToForm(connection?: TikTokConnectionStatusResponse): ConnectionFormState {
  if (!connection) {
    return emptyForm();
  }
  return {
    platformAccountId: connection.platformAccountId || "",
    platformUsername: connection.platformUsername || "",
    accessToken: "",
    refreshToken: "",
    tokenExpiresAt: toDateTimeLocal(connection.tokenExpiresAt),
    scopesCsv: (connection.scopes || []).join(","),
    status: connection.status,
  };
}

function parseScopes(scopesCsv: string) {
  const scopes = scopesCsv
    .split(",")
    .map((scope) => scope.trim())
    .filter(Boolean);
  return scopes.length > 0 ? scopes : undefined;
}

function toDateTimeLocal(value?: string | null) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function parseDateTimeLocal(value: string) {
  if (!value.trim()) {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date.toISOString();
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 break-all text-zinc-100">{value}</p>
    </div>
  );
}
