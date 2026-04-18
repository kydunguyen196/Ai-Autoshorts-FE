export type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type GenerationStep =
  | "QUEUED"
  | "CONTENT_PREPARATION"
  | "SCRIPT_GENERATION"
  | "AUDIO_SYNTHESIS"
  | "SUBTITLE_GENERATION"
  | "VIDEO_COMPOSITION"
  | "COMPLETED";

export type TopicStatus = "PENDING" | "PROCESSING" | "USED" | "FAILED";

export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  validationErrors?: Record<string, string>;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string | null;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  tokenType: string;
  accessToken: string;
  expiresInSeconds: number;
  user: UserProfile;
  defaultChannel: Channel;
}

export interface CurrentUserResponse {
  user: UserProfile;
  defaultChannel: Channel;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface VideoJob {
  jobId: string;
  channelId: string;
  status: JobStatus;
  topic: string;
  style: string;
  voiceId?: string | null;
  durationSeconds: number;
  scriptText?: string | null;
  hookText?: string | null;
  ctaText?: string | null;
  captionText?: string | null;
  hashtags?: string[] | null;
  sceneBreakdownJson?: string | null;
  resolvedStyle?: string | null;
  promptTemplateId?: string | null;
  audioUrl?: string | null;
  subtitleUrl?: string | null;
  finalVideoUrl?: string | null;
  errorMessage?: string | null;
  currentStep?: GenerationStep | null;
  stepErrorDetails?: string | null;
  attemptCount?: number | null;
  startedAt?: string | null;
  completedAt?: string | null;
  lastErrorAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GenerateVideoRequest {
  topic: string;
  style?: string;
  contentStyle?: string;
  voiceId?: string;
  channelId?: string;
  durationSeconds: number;
}

export interface BatchGenerateItemRequest {
  topic: string;
  style?: string;
  contentStyle?: string;
  voiceId?: string;
  channelId?: string;
  durationSeconds?: number;
}

export interface BatchGenerateRequest {
  defaultStyle?: string;
  defaultContentStyle?: string;
  defaultVoiceId?: string;
  defaultChannelId?: string;
  defaultDurationSeconds?: number;
  items: BatchGenerateItemRequest[];
}

export interface BatchGenerateJobResult {
  jobId?: string;
  status?: JobStatus;
  topic?: string;
  errorMessage?: string;
}

export interface BatchGenerateResponse {
  batchId: string;
  totalRequested: number;
  totalAccepted: number;
  createdAt: string;
  jobs: BatchGenerateJobResult[];
}

export interface Topic {
  id: string;
  channelId: string;
  topic: string;
  contentStyle?: string | null;
  priority?: number;
  status: TopicStatus;
  source?: string | null;
  tags?: string[] | null;
  scheduledFor?: string | null;
  lastUsedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TopicCreateRequest {
  topic: string;
  contentStyle?: string;
  priority?: number;
  source?: string;
  tags?: string[];
  channelId?: string;
  scheduledFor?: string;
}

export interface TopicImportRequest {
  defaultSource?: string;
  defaultChannelId?: string;
  topics: TopicCreateRequest[];
}

export interface TopicImportResponse {
  totalRequested: number;
  totalImported: number;
  createdAt: string;
  topics: Topic[];
}

export interface FrontendBootstrapDefaults {
  defaultStyle: string;
  defaultDurationSeconds: number;
  minDurationSeconds: number;
  maxDurationSeconds: number;
  defaultVideosPageSize: number;
  maxVideosPageSize: number;
  defaultTopicsPageSize: number;
  maxTopicsPageSize: number;
  defaultVoiceId?: string | null;
}

export interface FrontendBootstrapResponse {
  supportedStyles: string[];
  videoStatuses: JobStatus[];
  generationSteps: GenerationStep[];
  topicStatuses: TopicStatus[];
  defaults: FrontendBootstrapDefaults;
}

export interface HealthResponse {
  status: string;
  service?: string;
  timestamp?: string;
  queueEnabled?: boolean;
  queueName?: string;
  queueExchange?: string;
  queueRoutingKey?: string;
  queueDeadLetterName?: string;
  queueMaxProcessingAttempts?: number;
}
