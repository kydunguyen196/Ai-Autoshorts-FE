"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/use-auth";
import { useBootstrapMetadata } from "@/hooks/use-bootstrap";
import { getErrorMessage } from "@/lib/utils";
import { batchGenerate } from "@/services/jobs-service";
import type { BatchGenerateItemRequest, BatchGenerateResponse } from "@/types/api";

type BatchItemState = {
  id: string;
  topic: string;
  style: string;
  durationSeconds: number;
  voiceId: string;
};

export default function BatchGeneratePage() {
  const { activeChannelId } = useAuth();
  const bootstrapQuery = useBootstrapMetadata();

  const styles = bootstrapQuery.data?.supportedStyles ?? ["motivation", "storytelling", "facts", "self-improvement"];
  const defaults = bootstrapQuery.data?.defaults;

  const [items, setItems] = useState<BatchItemState[]>([
    {
      id: crypto.randomUUID(),
      topic: "",
      style: defaults?.defaultStyle ?? styles[0],
      durationSeconds: defaults?.defaultDurationSeconds ?? 30,
      voiceId: defaults?.defaultVoiceId || "",
    },
  ]);

  const [result, setResult] = useState<BatchGenerateResponse | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: BatchGenerateItemRequest[]) =>
      batchGenerate({
        defaultChannelId: activeChannelId || undefined,
        defaultDurationSeconds: defaults?.defaultDurationSeconds ?? 30,
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
    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        topic: "",
        style: defaults?.defaultStyle ?? styles[0],
        durationSeconds: defaults?.defaultDurationSeconds ?? 30,
        voiceId: defaults?.defaultVoiceId || "",
      },
    ]);
  }

  function removeItem(id: string) {
    setItems((current) => (current.length <= 1 ? current : current.filter((item) => item.id !== id)));
  }

  function toPayloadItem(item: BatchItemState): BatchGenerateItemRequest {
    return {
      topic: item.topic.trim(),
      style: item.style || undefined,
      durationSeconds: item.durationSeconds,
      voiceId: item.voiceId || undefined,
    };
  }

  return (
    <div>
      <PageHeader
        title="Batch Generate"
        description="Submit multiple video generation jobs in a single queue operation."
      />

      <Card>
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

                <div className="grid gap-3 md:grid-cols-3">
                  <Select
                    value={item.style}
                    onChange={(event) => updateItem(item.id, { style: event.target.value })}
                  >
                    {styles.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </Select>

                  <Input
                    type="number"
                    min={defaults?.minDurationSeconds ?? 10}
                    max={defaults?.maxDurationSeconds ?? 120}
                    value={item.durationSeconds}
                    onChange={(event) =>
                      updateItem(item.id, { durationSeconds: Number(event.target.value) })
                    }
                  />

                  <Input
                    value={item.voiceId}
                    onChange={(event) => updateItem(item.id, { voiceId: event.target.value })}
                    placeholder="Voice ID (optional)"
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
            Batch {result.batchId} - accepted {result.totalAccepted}/{result.totalRequested}
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-900/60 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Topic</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Job</th>
                  <th className="px-4 py-3 font-medium">Message</th>
                </tr>
              </thead>
              <tbody>
                {result.jobs.map((job, index) => (
                  <tr key={`${job.topic}-${index}`} className="border-t border-zinc-800/80">
                    <td className="px-4 py-3 text-zinc-100">{job.topic || "-"}</td>
                    <td className="px-4 py-3 text-zinc-300">{job.status || "SKIPPED"}</td>
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
