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
      <div className="flex h-9 w-40 items-center justify-center rounded-full border border-[rgba(0,0,0,0.08)] bg-white text-[#7a7a7a]">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => setActiveChannelId(e.target.value)}
        className="h-9 appearance-none rounded-full border border-[rgba(0,0,0,0.08)] bg-white pl-4 pr-9 text-[14px] tracking-[-0.224px] text-[#1d1d1f] focus:outline-2 focus:outline-[#0071e3] cursor-pointer"
      >
        {(channelsQuery.data ?? []).map((channel) => (
          <option key={channel.id} value={channel.id}>
            {channel.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-[#7a7a7a]" />
    </div>
  );
}
