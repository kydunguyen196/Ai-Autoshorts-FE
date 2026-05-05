import { httpClient } from "@/services/http-client";
import type {
  BatchGenerateRequest,
  BatchGenerateResponse,
  GenerateVideoRequest,
  GroupReviewSummary,
  JobStatus,
  PagedResponse,
  PublishVideoRequest,
  RejectVideoRequest,
  VideoJob,
  VideoPublishStatus,
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

export async function getJobsByGroup(groupId: string, params: JobsFeedParams) {
  const { data } = await httpClient.get<PagedResponse<VideoJob>>(`/api/videos/group/${groupId}`, {
    params,
  });
  return data;
}

export async function getTopCandidatesByGroup(groupId: string, params: JobsFeedParams) {
  const { data } = await httpClient.get<PagedResponse<VideoJob>>(
    `/api/videos/group/${groupId}/top-candidates`,
    { params },
  );
  return data;
}

export async function getJobsByBatch(batchId: string, params: JobsFeedParams) {
  const { data } = await httpClient.get<PagedResponse<VideoJob>>(`/api/videos/batch/${batchId}`, {
    params,
  });
  return data;
}

export async function getGroupReviewSummary(groupId: string) {
  const { data } = await httpClient.get<GroupReviewSummary>(`/api/videos/group/${groupId}/review-summary`);
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

export async function approveJob(jobId: string) {
  const { data } = await httpClient.post<VideoJob>(`/api/videos/${jobId}/approve`);
  return data;
}

export async function rejectJob(jobId: string, payload: RejectVideoRequest) {
  const { data } = await httpClient.post<VideoJob>(`/api/videos/${jobId}/reject`, payload);
  return data;
}

export async function selectJobForPublish(jobId: string) {
  const { data } = await httpClient.post<VideoJob>(`/api/videos/${jobId}/select-for-publish`);
  return data;
}

export async function publishJob(jobId: string, payload?: PublishVideoRequest) {
  const { data } = await httpClient.post<VideoJob>(`/api/videos/${jobId}/publish`, payload ?? {});
  return data;
}

export async function getJobPublishStatus(jobId: string) {
  const { data } = await httpClient.get<VideoPublishStatus>(`/api/videos/${jobId}/publish`);
  return data;
}

export async function exportJob(jobId: string) {
  const { data } = await httpClient.post<VideoJob>(`/api/videos/${jobId}/export`);
  return data;
}

export async function batchGenerate(payload: BatchGenerateRequest) {
  const { data } = await httpClient.post<BatchGenerateResponse>(
    "/api/videos/batch-generate",
    payload,
  );
  return data;
}
