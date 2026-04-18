"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { PageHeader } from "@/components/ui/page-header";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/use-auth";
import { useBootstrapMetadata } from "@/hooks/use-bootstrap";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import { createTopic, getTopicsFeed, importTopics } from "@/services/topics-service";
import type { TopicCreateRequest, TopicStatus } from "@/types/api";

export default function TopicsPage() {
  const queryClient = useQueryClient();
  const { activeChannelId } = useAuth();
  const bootstrapQuery = useBootstrapMetadata();

  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<TopicStatus | "">("");

  const [createTopicValue, setCreateTopicValue] = useState("");
  const [createStyle, setCreateStyle] = useState("");
  const [createPriority, setCreatePriority] = useState(0);
  const [createSource, setCreateSource] = useState("manual");
  const [createTags, setCreateTags] = useState("");

  const [importText, setImportText] = useState("");
  const [importDefaultSource, setImportDefaultSource] = useState("import");
  const [importResult, setImportResult] = useState<string | null>(null);

  const statuses = bootstrapQuery.data?.topicStatuses ?? ["PENDING", "PROCESSING", "USED", "FAILED"];
  const styles = bootstrapQuery.data?.supportedStyles ?? ["motivation", "storytelling", "facts", "self-improvement"];

  const topicsQuery = useQuery({
    queryKey: ["topics", "feed", page, status],
    queryFn: () =>
      getTopicsFeed({
        page,
        limit: bootstrapQuery.data?.defaults.defaultTopicsPageSize ?? 20,
        status: status || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: TopicCreateRequest) => createTopic(payload),
    onSuccess: () => {
      setCreateTopicValue("");
      setCreateTags("");
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });

  const importMutation = useMutation({
    mutationFn: (payload: { defaultSource: string; topics: TopicCreateRequest[] }) =>
      importTopics({
        defaultSource: payload.defaultSource,
        defaultChannelId: activeChannelId || undefined,
        topics: payload.topics,
      }),
    onSuccess: (response) => {
      setImportResult(`Imported ${response.totalImported} of ${response.totalRequested} topics.`);
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });

  const parsedImportPreview = useMemo(() => parseImportLines(importText), [importText]);

  return (
    <div>
      <PageHeader
        title="Topics"
        description="Build a reliable idea pipeline with create and import workflows."
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-zinc-100">Create Topic</h2>
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();

              createMutation.mutate({
                topic: createTopicValue,
                contentStyle: createStyle || undefined,
                priority: createPriority,
                source: createSource || undefined,
                tags: splitTags(createTags),
                channelId: activeChannelId || undefined,
              });
            }}
          >
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Topic</span>
              <Input
                value={createTopicValue}
                onChange={(event) => setCreateTopicValue(event.target.value)}
                placeholder="Example: 5 hooks that increase watch time"
                required
              />
            </label>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Style</span>
                <Select value={createStyle} onChange={(event) => setCreateStyle(event.target.value)}>
                  <option value="">Auto/default</option>
                  {styles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Priority</span>
                <Input
                  type="number"
                  min={0}
                  max={1000}
                  value={createPriority}
                  onChange={(event) => setCreatePriority(Number(event.target.value))}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-zinc-300">Source</span>
                <Input
                  value={createSource}
                  onChange={(event) => setCreateSource(event.target.value)}
                  placeholder="manual"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Tags (comma separated)</span>
              <Input
                value={createTags}
                onChange={(event) => setCreateTags(event.target.value)}
                placeholder="hooks,retention,creator"
              />
            </label>

            {createMutation.isError ? (
              <p className="rounded-lg border border-red-700/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {getErrorMessage(createMutation.error)}
              </p>
            ) : null}

            <Button type="submit" disabled={createMutation.isPending || !activeChannelId}>
              {createMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Creating...
                </span>
              ) : (
                "Create Topic"
              )}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-zinc-100">Import Topics</h2>
          <p className="mt-2 text-sm text-zinc-400">
            One per line. Format: <code className="text-zinc-200">topic | style | priority</code>
          </p>

          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              const items = parseImportLines(importText);
              importMutation.mutate({
                defaultSource: importDefaultSource,
                topics: items,
              });
            }}
          >
            <label className="block space-y-2">
              <span className="text-sm text-zinc-300">Default source</span>
              <Input
                value={importDefaultSource}
                onChange={(event) => setImportDefaultSource(event.target.value)}
              />
            </label>

            <Textarea
              value={importText}
              onChange={(event) => setImportText(event.target.value)}
              placeholder="How to stay consistent | motivation | 90"
              className="min-h-36"
            />

            <p className="text-xs text-zinc-500">{parsedImportPreview.length} valid topic(s) detected.</p>

            {importResult ? (
              <p className="rounded-lg border border-emerald-700/50 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                {importResult}
              </p>
            ) : null}

            {importMutation.isError ? (
              <p className="rounded-lg border border-red-700/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {getErrorMessage(importMutation.error)}
              </p>
            ) : null}

            <Button type="submit" disabled={importMutation.isPending || parsedImportPreview.length === 0 || !activeChannelId}>
              {importMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Importing...
                </span>
              ) : (
                "Import Topics"
              )}
            </Button>
          </form>
        </Card>
      </section>

      <section className="mt-6">
        <Card>
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <Select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as TopicStatus | "");
                setPage(0);
              }}
            >
              <option value="">All statuses</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>

            <div className="md:col-span-2 flex items-center justify-end">
              <Button variant="secondary" onClick={() => topicsQuery.refetch()}>
                Refresh
              </Button>
            </div>
          </div>

          {topicsQuery.isLoading ? (
            <p className="text-sm text-zinc-400">Loading topics...</p>
          ) : topicsQuery.isError ? (
            <p className="text-sm text-red-300">Failed to load topic feed.</p>
          ) : topicsQuery.data && topicsQuery.data.items.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-zinc-900/60 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Topic</th>
                    <th className="px-4 py-3 font-medium">Style</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {topicsQuery.data.items.map((topic) => (
                    <tr key={topic.id} className="border-t border-zinc-800/80">
                      <td className="px-4 py-3 text-zinc-100">{topic.topic}</td>
                      <td className="px-4 py-3 text-zinc-300">{topic.contentStyle || "-"}</td>
                      <td className="px-4 py-3 text-zinc-300">{topic.status}</td>
                      <td className="px-4 py-3 text-zinc-300">{topic.priority ?? 0}</td>
                      <td className="px-4 py-3 text-zinc-400">{formatDateTime(topic.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No topics found"
              description="Create or import topic ideas to seed your generation pipeline."
            />
          )}

          {topicsQuery.data ? (
            <PaginationControls
              page={topicsQuery.data.page}
              totalPages={topicsQuery.data.totalPages}
              hasPrevious={topicsQuery.data.hasPrevious}
              hasNext={topicsQuery.data.hasNext}
              onChange={(nextPage) => setPage(Math.max(nextPage, 0))}
            />
          ) : null}
        </Card>
      </section>
    </div>
  );
}

function splitTags(value: string) {
  if (!value.trim()) {
    return undefined;
  }

  const tags = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);

  return tags.length > 0 ? tags : undefined;
}

function parseImportLines(input: string): TopicCreateRequest[] {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const parsed: TopicCreateRequest[] = [];

  for (const line of lines) {
    const [topicRaw, styleRaw, priorityRaw] = line.split("|").map((part) => part?.trim());
    if (!topicRaw) {
      continue;
    }

    const priorityValue = Number(priorityRaw);
    parsed.push({
      topic: topicRaw,
      contentStyle: styleRaw || undefined,
      priority: Number.isFinite(priorityValue) ? priorityValue : undefined,
    });
  }

  return parsed;
}
