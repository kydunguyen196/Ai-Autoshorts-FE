"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import {
  createBillingCheckout,
  createBillingPortal,
  getBillingCredits,
  getBillingSubscription,
  listBillingPlans,
  listBillingUsage,
} from "@/services/billing-service";

export default function BillingPage() {
  const queryClient = useQueryClient();
  const plansQuery = useQuery({ queryKey: ["billing", "plans"], queryFn: listBillingPlans });
  const subscriptionQuery = useQuery({
    queryKey: ["billing", "subscription"],
    queryFn: getBillingSubscription,
  });
  const creditsQuery = useQuery({ queryKey: ["billing", "credits"], queryFn: getBillingCredits });
  const usageQuery = useQuery({ queryKey: ["billing", "usage"], queryFn: listBillingUsage });

  const checkoutMutation = useMutation({
    mutationFn: createBillingCheckout,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      window.location.assign(response.url);
    },
  });

  const portalMutation = useMutation({
    mutationFn: createBillingPortal,
    onSuccess: (response) => {
      window.location.assign(response.url);
    },
  });

  const subscription = subscriptionQuery.data;
  const credits = creditsQuery.data;

  return (
    <div>
      <PageHeader
        title="Billing & Credits"
        description="Manage subscription credits for commercial faceless video generation."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-indigo-500/40 bg-indigo-500/15 p-3 text-indigo-100">
              <WalletCards className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Current plan</p>
              <h2 className="text-xl font-semibold text-zinc-100">
                {subscription?.planKey ?? "loading"}
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3 text-sm">
            <InfoRow label="Status" value={subscription?.status ?? "-"} />
            <InfoRow label="Credits" value={String(credits?.creditsBalance ?? subscription?.creditsBalance ?? "-")} />
            <InfoRow label="Low credit alert" value={`${credits?.lowCreditThreshold ?? 5} credits`} />
          </div>

          <Button
            className="mt-5"
            variant="secondary"
            disabled={portalMutation.isPending}
            onClick={() => portalMutation.mutate()}
          >
            <CreditCard className="h-4 w-4" /> Open Billing Portal
          </Button>

          {portalMutation.data ? (
            <p className="mt-3 text-sm text-zinc-400">
              Redirecting to Stripe billing portal...
            </p>
          ) : null}
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {(plansQuery.data ?? []).map((plan) => {
            const current = plan.planKey === subscription?.planKey;
            return (
              <Card key={plan.planKey} className={current ? "border-indigo-500/60" : ""}>
                <p className="text-sm text-zinc-500">{plan.audience}</p>
                <h3 className="mt-2 text-xl font-semibold text-zinc-100">{plan.name}</h3>
                <p className="mt-2 text-3xl font-semibold text-zinc-50">
                  {plan.monthlyPriceUsdCents === 0
                    ? "Free"
                    : `$${(plan.monthlyPriceUsdCents / 100).toFixed(0)}`}
                  <span className="text-sm font-normal text-zinc-500"> / month</span>
                </p>
                <p className="mt-2 text-sm text-zinc-300">{plan.monthlyCredits} credits / month</p>
                <Button
                  className="mt-5 w-full"
                  variant={current ? "secondary" : "primary"}
                  disabled={current || plan.planKey === "free" || checkoutMutation.isPending}
                  onClick={() => checkoutMutation.mutate(plan.planKey)}
                >
                  {checkoutMutation.isPending ? "Opening Stripe..." : current ? "Current Plan" : "Upgrade"}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {checkoutMutation.isError ? (
        <p className="mt-4 rounded-lg border border-red-700/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          Stripe checkout is not available. Confirm `STRIPE_ENABLED`, `STRIPE_SECRET_KEY`, and the plan price IDs are configured.
        </p>
      ) : null}

      {portalMutation.isError ? (
        <p className="mt-4 rounded-lg border border-red-700/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          Stripe portal is available after your first completed Stripe checkout.
        </p>
      ) : null}

      <Card className="mt-4">
        <h3 className="text-lg font-semibold text-zinc-100">Recent Credit Activity</h3>
        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-900/60 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Reason</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Balance</th>
                <th className="px-4 py-3 font-medium">Reference</th>
              </tr>
            </thead>
            <tbody>
              {(usageQuery.data ?? []).map((entry) => (
                <tr key={entry.id} className="border-t border-zinc-800/80">
                  <td className="px-4 py-3 text-zinc-300">{entry.reason}</td>
                  <td className={entry.amount < 0 ? "px-4 py-3 text-red-200" : "px-4 py-3 text-emerald-200"}>
                    {entry.amount}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{entry.balanceAfter}</td>
                  <td className="px-4 py-3 text-zinc-500">{entry.referenceId ?? "-"}</td>
                </tr>
              ))}
              {usageQuery.data?.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-zinc-500" colSpan={4}>
                    No credit activity yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-zinc-100">{value}</p>
    </div>
  );
}
