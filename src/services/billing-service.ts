import { httpClient } from "@/services/http-client";
import type {
  BillingCredits,
  BillingPlan,
  BillingPortalResponse,
  BillingSubscription,
  BillingUsageEntry,
} from "@/types/api";

export async function listBillingPlans() {
  const { data } = await httpClient.get<BillingPlan[]>("/api/billing/plans");
  return data;
}

export async function getBillingSubscription() {
  const { data } = await httpClient.get<BillingSubscription>("/api/billing/subscription");
  return data;
}

export async function getBillingCredits() {
  const { data } = await httpClient.get<BillingCredits>("/api/billing/credits");
  return data;
}

export async function listBillingUsage() {
  const { data } = await httpClient.get<BillingUsageEntry[]>("/api/billing/usage");
  return data;
}

export async function createBillingCheckout(planKey: string) {
  const { data } = await httpClient.post<BillingPortalResponse>("/api/billing/checkout", { planKey });
  return data;
}

export async function createBillingPortal() {
  const { data } = await httpClient.post<BillingPortalResponse>("/api/billing/portal", {});
  return data;
}
