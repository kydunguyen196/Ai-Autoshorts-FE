"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { retryJob } from "@/services/jobs-service";

export function useRetryJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => retryJob(jobId),
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: ["jobs", "feed"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", "recent"] });
      queryClient.setQueryData(["jobs", "detail", job.jobId], job);
    },
  });
}
