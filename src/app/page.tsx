import Link from "next/link";
import { ArrowRight, Bot, Layers, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Queue-backed generation",
    description:
      "Create single or batch jobs and let durable workers process videos reliably in the background.",
    icon: Bot,
  },
  {
    title: "Topic automation",
    description:
      "Manage topic pools, import ideas at scale, and keep your creator pipeline consistently active.",
    icon: Layers,
  },
  {
    title: "Creator-ready outputs",
    description:
      "Track steps, metadata, subtitles, and final video assets from one production dashboard.",
    icon: Sparkles,
  },
];

export default function LandingPage() {
  const primaryLinkClass = cn(
    "inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 text-base font-medium text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] transition hover:brightness-110",
  );
  const secondaryLinkClass = cn(
    "inline-flex h-11 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/70 px-5 text-base font-medium text-zinc-100 transition hover:bg-zinc-800",
  );
  const ghostLinkClass = cn(
    "inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800/60",
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(1200px_640px_at_10%_-10%,rgba(99,102,241,0.35),transparent),radial-gradient(1000px_600px_at_90%_0%,rgba(56,189,248,0.22),transparent),#07070b]">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_40%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 md:px-10">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-indigo-300/90">AutoShorts AI</p>
            <h1 className="mt-2 text-xl font-semibold text-zinc-100">AI Video Automation</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link className={ghostLinkClass} href="/login">
              Sign In
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 text-sm font-medium text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] transition hover:brightness-110"
              href="/register"
            >
              Get Started
            </Link>
          </div>
        </header>

        <section className="mt-20 max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
            AI video automation for creators
          </p>
          <h2 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
            Run your short-form content engine with queue-safe AI workflows.
          </h2>
          <p className="mt-6 max-w-2xl text-base text-zinc-300 md:text-lg">
            AutoShorts AI turns ideas into production-ready short videos with durable job execution,
            step-level visibility, and creator-focused controls.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link className={cn(primaryLinkClass, "gap-2")} href="/register">
              Start Building <ArrowRight className="h-4 w-4" />
            </Link>
            <Link className={secondaryLinkClass} href="/login">
              Open Dashboard
            </Link>
          </div>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title} className="bg-zinc-900/45">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/40 to-blue-400/30 text-indigo-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-100">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.description}</p>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
}
