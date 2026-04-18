"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2 } from "lucide-react";

import { Select } from "@/components/ui/select";
import { useAuth } from "@/features/auth/use-auth";
import { listChannels } from "@/services/channels-service";

export function ChannelSelector() {
  const { activeChannelId, setActiveChannelId, defaultChannel } = useAuth();

  const channelsQuery = useQuery({
    queryKey: ["channels", "list"],
    queryFn: listChannels,
  });

  const value = activeChannelId || defaultChannel?.id || "";

  return (
    <div className="relative min-w-44">
      {channelsQuery.isLoading ? (
        <div className="flex h-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/70 text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <>
          <Select
            value={value}
            onChange={(event) => setActiveChannelId(event.target.value)}
            className="appearance-none pr-10"
          >
            {(channelsQuery.data ?? []).map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </Select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-zinc-400" />
        </>
      )}
    </div>
  );
}
