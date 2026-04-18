import { httpClient } from "@/services/http-client";
import type {
  BatchGenerateRequest,
  BatchGenerateResponse,
  GenerateVideoRequest,
  JobStatus,
  PagedResponse,
  VideoJob,
} from "@/types/api";

export interface JobsFeedParams {
  page?: number;
  limit?: number;
  status?: JobStatus;
}

export async function listRecentJobs(limit = 20, status?: JobStatus) {
  const { data } = await httpClient.get<VideoJob[]>("/api/videos", {
    params: { limit, status },
  });
  return data;
}

export async function getJobsFeed(params: JobsFeedParams) {
  const { data } = await httpClient.get<PagedResponse<VideoJob>>("/api/videos/feed", {
    params,
  });
  return data;
}

export async function getJob(jobId: string) {
  const { data } = await httpClient.get<VideoJob>(`/api/videos/${jobId}`);
  return data;
}

export async function generateVideo(payload: GenerateVideoRequest) {
  const { data } = await httpClient.post<VideoJob>("/api/videos/generate", payload);
  return data;
}

export async function retryJob(jobId: string) {
  const { data } = await httpClient.post<VideoJob>(`/api/videos/${jobId}/retry`);
  return data;
}

export async function batchGenerate(payload: BatchGenerateRequest) {
  const { data } = await httpClient.post<BatchGenerateResponse>(
    "/api/videos/batch-generate",
    payload,
  );
  return data;
}
