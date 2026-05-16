"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2 } from "lucide-react";

import { useAuth } from "@/features/auth/use-auth";
import { listChannels } from "@/services/channels-service";

export function ChannelSelector() {
  const { activeChannelId, setActiveChannelId, defaultChannel } = useAuth();

  const channelsQuery = useQuery({
    queryKey: ["channels", "list"],
    queryFn: listChannels,
  });

  const value = activeChannelId || defaultChannel?.id || "";

  if (channelsQuery.isLoading) {
    return (
      <div className="flex h-9 w-40 items-center justify-center rounded-full border border-[#d8d0c1] bg-[#fffaf0] text-[#686157]">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => setActiveChannelId(e.target.value)}
        className="h-9 cursor-pointer appearance-none rounded-full border border-[#d8d0c1] bg-[#fffaf0] pl-4 pr-9 text-[14px] text-[#11100e] focus:outline-2 focus:outline-[#4b6fff]"
      >
        {(channelsQuery.data ?? []).map((channel) => (
          <option key={channel.id} value={channel.id}>
            {channel.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-[#686157]" />
    </div>
  );
}
