"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/use-auth";
import { formatDateTime, getErrorMessage } from "@/lib/utils";
import { createChannel, listChannels } from "@/services/channels-service";

export default function ChannelsPage() {
  const queryClient = useQueryClient();
  const { activeChannelId, setActiveChannelId } = useAuth();

  const channelsQuery = useQuery({
    queryKey: ["channels", "list"],
    queryFn: listChannels,
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createMutation = useMutation({
    mutationFn: () => createChannel({ name, description }),
    onSuccess: (channel) => {
      setName("");
      setDescription("");
      setActiveChannelId(channel.id);
      queryClient.invalidateQueries({ queryKey: ["channels", "list"] });
    },
  });

  return (
    <div>
      <PageHeader
        title="Channels"
        description="Organize projects by channel ownership and choose the active working channel."
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-foreground">Create Channel</h2>
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              createMutation.mutate();
            }}
          >
            <label className="block space-y-2">
              <span className="text-sm text-strong">Name</span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: Main Creator Channel"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-strong">Description</span>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional"
              />
            </label>

            {createMutation.isError ? (
              <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                {getErrorMessage(createMutation.error)}
              </p>
            ) : null}

            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Creating...
                </span>
              ) : (
                "Create Channel"
              )}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-foreground">Your Channels</h2>

          {channelsQuery.isLoading ? (
            <p className="mt-4 text-sm text-muted">Loading channels...</p>
          ) : channelsQuery.isError ? (
            <p className="mt-4 text-sm text-danger">Failed to load channels.</p>
          ) : channelsQuery.data && channelsQuery.data.length > 0 ? (
            <div className="mt-4 space-y-3">
              {channelsQuery.data.map((channel) => {
                const isActive = channel.id === activeChannelId;

                return (
                  <div
                    key={channel.id}
                    className="rounded-xl border border-border bg-surface px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{channel.name}</p>
                          {channel.isDefault ? <Badge intent="info">DEFAULT</Badge> : null}
                          {isActive ? <Badge intent="success">ACTIVE</Badge> : null}
                        </div>
                        <p className="mt-1 text-sm text-muted">{channel.description || "No description"}</p>
                        <p className="mt-1 text-xs text-faint">Created {formatDateTime(channel.createdAt)}</p>
                      </div>

                      <Button
                        variant={isActive ? "ghost" : "secondary"}
                        size="sm"
                        onClick={() => setActiveChannelId(channel.id)}
                        disabled={isActive}
                      >
                        {isActive ? "Selected" : "Set Active"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No channels yet"
              description="Create your first channel to start organizing generation work."
              className="mt-4"
            />
          )}
        </Card>
      </section>
    </div>
  );
}
