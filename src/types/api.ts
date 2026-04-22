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

export type ContentGenerationMode = "REAL" | "MOCK" | "FALLBACK";
export type AudioGenerationMode = "REAL" | "MOCK" | "FALLBACK";

export type ReviewStatus = "DRAFT" | "GENERATED" | "APPROVED" | "REJECTED";

export type PublishStatus =
  | "NOT_PUBLISHED"
  | "READY_TO_PUBLISH"
  | "PUBLISHING"
  | "PUBLISHED"
  | "PUBLISH_FAILED";

export type CharacterProfileStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type CharacterCampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";

export type TikTokConnectionStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "REVOKED" | "ERROR";

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
  contentGenerationMode?: ContentGenerationMode | null;
  contentVariantKey?: string | null;
  hookStrategy?: string | null;
  ctaStrategy?: string | null;
  structureStrategy?: string | null;
  hookStrengthScore?: number | null;
  engagementScore?: number | null;
  engagementTagsJson?: string | null;

  generationBatchId?: string | null;
  generationGroupId?: string | null;
  characterProfileId?: string | null;
  characterCampaignId?: string | null;
  storyAngle?: string | null;
  productPlacementMode?: string | null;
  adDisclosureMode?: string | null;
  sceneCountTarget?: number | null;
  characterConsistencyMode?: string | null;

  variantIndex?: number | null;
  variantCount?: number | null;
  rankingScore?: number | null;
  isTopCandidate?: boolean | null;
  topCandidateRank?: number | null;

  reviewStatus?: ReviewStatus | null;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  rejectionReason?: string | null;
  selectedForPublish?: boolean | null;

  publishStatus?: PublishStatus | null;
  scheduledPublishAt?: string | null;
  publishPlatform?: string | null;
  publishReadyAt?: string | null;
  publishRequestedAt?: string | null;
  publishStartedAt?: string | null;
  publishedAt?: string | null;
  publishAttemptCount?: number | null;
  publishProvider?: string | null;
  publishExternalId?: string | null;
  publishTargetAccountId?: string | null;
  publishRequestPayloadJson?: string | null;
  publishResponsePayloadJson?: string | null;
  publishFailureReason?: string | null;
  publishFailureDetails?: string | null;
  publishLastErrorAt?: string | null;
  publishLastStatusCheckAt?: string | null;

  audioUrl?: string | null;
  audioGenerationMode?: AudioGenerationMode | null;
  audioProvider?: string | null;
  audioVoiceId?: string | null;
  audioModelId?: string | null;
  audioOutputFormat?: string | null;
  audioProviderRequestDurationMs?: number | null;
  audioFailureReason?: string | null;
  audioFailureDetails?: string | null;

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

  characterProfileId?: string;
  characterCampaignId?: string;
  storyAngle?: string;
  productPlacementMode?: string;
  adDisclosureMode?: string;
  sceneCountTarget?: number;
  characterConsistencyMode?: string;

  durationSeconds: number;
  variantCount?: number;
}

export interface BatchGenerateItemRequest {
  topic: string;
  style?: string;
  contentStyle?: string;
  voiceId?: string;
  channelId?: string;

  characterProfileId?: string;
  characterCampaignId?: string;
  storyAngle?: string;
  productPlacementMode?: string;
  adDisclosureMode?: string;
  sceneCountTarget?: number;
  characterConsistencyMode?: string;

  durationSeconds?: number;
  variantCount?: number;
}

export interface BatchGenerateRequest {
  defaultStyle?: string;
  defaultContentStyle?: string;
  defaultVoiceId?: string;
  defaultChannelId?: string;

  defaultCharacterProfileId?: string;
  defaultCharacterCampaignId?: string;
  defaultStoryAngle?: string;
  defaultProductPlacementMode?: string;
  defaultAdDisclosureMode?: string;
  defaultSceneCountTarget?: number;
  defaultCharacterConsistencyMode?: string;

  defaultDurationSeconds?: number;
  defaultVariantCount?: number;

  items: BatchGenerateItemRequest[];
}

export interface BatchGenerateJobResult {
  jobId?: string;
  batchId?: string;
  generationGroupId?: string;
  variantIndex?: number;
  variantCount?: number;
  status?: JobStatus;
  topic?: string;
  errorMessage?: string;
}

export interface BatchGenerateResponse {
  batchId: string;
  totalRequested: number;
  totalVariantsRequested?: number;
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

export interface CharacterProfile {
  id: string;
  channelId: string;
  name: string;
  archetype?: string | null;
  personality?: string | null;
  toneOfVoice?: string | null;
  speakingStyle?: string | null;
  catchphrases?: string | null;
  visualStyle?: string | null;
  language?: string | null;
  targetAudience?: string | null;
  allowedTopics?: string | null;
  forbiddenTopics?: string | null;
  defaultVoiceProvider?: string | null;
  defaultVoiceId?: string | null;
  status: CharacterProfileStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CharacterProfileUpsertRequest {
  channelId?: string;
  name: string;
  archetype?: string;
  personality?: string;
  toneOfVoice?: string;
  speakingStyle?: string;
  catchphrases?: string;
  visualStyle?: string;
  language?: string;
  targetAudience?: string;
  allowedTopics?: string;
  forbiddenTopics?: string;
  defaultVoiceProvider?: string;
  defaultVoiceId?: string;
  status?: CharacterProfileStatus;
}

export interface CharacterCampaign {
  id: string;
  channelId: string;
  characterProfileId?: string | null;
  productName: string;
  productType?: string | null;
  productDescription?: string | null;
  productUrl?: string | null;
  targetPlatform?: string | null;
  campaignObjective?: string | null;
  callToAction?: string | null;
  targetAudience?: string | null;
  offerSummary?: string | null;
  status: CharacterCampaignStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CharacterCampaignUpsertRequest {
  channelId?: string;
  characterProfileId?: string;
  productName: string;
  productType?: string;
  productDescription?: string;
  productUrl?: string;
  targetPlatform?: string;
  campaignObjective?: string;
  callToAction?: string;
  targetAudience?: string;
  offerSummary?: string;
  status?: CharacterCampaignStatus;
}

export interface PublishVideoRequest {
  publishPlatform?: string;
}

export interface RejectVideoRequest {
  rejectionReason: string;
}

export interface VideoPublishStatus {
  jobId: string;
  publishStatus?: PublishStatus | null;
  publishPlatform?: string | null;
  publishProvider?: string | null;
  publishExternalId?: string | null;
  publishTargetAccountId?: string | null;
  publishRequestPayloadJson?: string | null;
  publishResponsePayloadJson?: string | null;
  publishReadyAt?: string | null;
  publishRequestedAt?: string | null;
  publishStartedAt?: string | null;
  publishedAt?: string | null;
  publishAttemptCount?: number | null;
  publishFailureReason?: string | null;
  publishFailureDetails?: string | null;
  publishLastErrorAt?: string | null;
  publishLastStatusCheckAt?: string | null;
  reviewStatus?: ReviewStatus | null;
  selectedForPublish?: boolean | null;
  publishable?: boolean | null;
  publishReadinessReason?: string | null;
  tiktokConnectionStatus?: string | null;
}

export interface GroupReviewSummary {
  generationGroupId: string;
  totalJobs: number;
  selectedJobId?: string | null;
  reviewStatusCounts: Record<string, number>;
}

export interface TikTokConnectionStatusResponse {
  id?: string;
  channelId: string;
  platformAccountId?: string | null;
  platformUsername?: string | null;
  tokenExpiresAt?: string | null;
  scopes?: string[];
  status: TikTokConnectionStatus;
  active?: boolean;
  lastSyncAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface TikTokConnectionUpsertRequest {
  channelId?: string;
  platformAccountId?: string;
  platformUsername?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  scopes?: string[];
  status?: TikTokConnectionStatus;
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
