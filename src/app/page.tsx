import Link from "next/link";
import { ArrowRight, Bot, Layers, Sparkles } from "lucide-react";

/**
 * Landing page — Apple full-bleed tile rhythm.
 * Tile 1: near-black hero (product-tile-dark)
 * Tile 2: white feature grid (product-tile-light)
 * Tile 3: parchment CTA (product-tile-parchment)
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen">

      {/* ── Global Nav — true black ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex h-[44px] items-center justify-between bg-black px-5 md:px-10">
        <span className="text-[12px] tracking-[-0.12px] text-white/80">AutoShorts AI</span>
        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="text-[12px] tracking-[-0.12px] text-white/80 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="btn-press inline-flex h-8 items-center rounded-full bg-[#0066cc] px-4 text-[12px] text-white transition-all hover:bg-[#0077ed]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Tile 1: Dark hero ───────────────────────────────────────────── */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-[#272729] px-6 py-[80px] text-center">
        <p className="text-[14px] tracking-[-0.224px] text-[#2997ff]">
          AI video automation for creators
        </p>
        <h1 className="mt-5 max-w-3xl text-[56px] font-semibold leading-[1.07] tracking-[-0.28px] text-white md:text-[56px]">
          Your short-form content engine.
        </h1>
        <p className="mt-5 max-w-xl text-[28px] font-normal leading-[1.14] text-[#cccccc]">
          Queue-safe AI workflows. Step-level visibility. Creator-ready outputs.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="btn-press inline-flex h-[44px] items-center gap-2 rounded-full bg-[#0066cc] px-[22px] text-[17px] text-white transition-all hover:bg-[#0077ed]"
          >
            Start Building <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="btn-press inline-flex h-[44px] items-center rounded-full border border-white/30 bg-transparent px-[22px] text-[17px] text-white transition-all hover:bg-white/10"
          >
            Open Dashboard
          </Link>
        </div>
      </section>

      {/* ── Tile 2: White feature grid ──────────────────────────────────── */}
      <section className="bg-white px-6 py-[80px]">
        <div className="mx-auto max-w-[980px]">
          <h2 className="text-center text-[40px] font-semibold leading-[1.1] tracking-[-0.374px] text-[#1d1d1f]">
            Everything you need to ship.
          </h2>
          <p className="mt-4 text-center text-[21px] font-normal leading-[1.19] tracking-[0.231px] text-[#7a7a7a]">
            From topic to published video — one pipeline.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-[18px] border border-[#e0e0e0] bg-[#f5f5f7] p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#0066cc]/10 text-[#0066cc]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-[21px] font-semibold tracking-[-0.374px] text-[#1d1d1f]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-[#7a7a7a]">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Tile 3: Parchment CTA ───────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center bg-[#f5f5f7] px-6 py-[80px] text-center">
        <h2 className="text-[40px] font-semibold leading-[1.1] tracking-[-0.374px] text-[#1d1d1f]">
          Ready to automate?
        </h2>
        <p className="mt-4 text-[21px] font-normal leading-[1.19] tracking-[0.231px] text-[#7a7a7a]">
          Free to start. No credit card required.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="btn-press inline-flex h-[44px] items-center rounded-full bg-[#0066cc] px-[22px] text-[17px] text-white transition-all hover:bg-[#0077ed]"
          >
            Create Account
          </Link>
          <Link
            href="/login"
            className="btn-press inline-flex h-[44px] items-center rounded-full border border-[#0066cc] bg-transparent px-[22px] text-[17px] text-[#0066cc] transition-all hover:bg-[#0066cc]/05"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#f5f5f7] border-t border-[#e0e0e0] px-6 py-16">
        <div className="mx-auto max-w-[980px]">
          <p className="text-[12px] tracking-[-0.12px] text-[#7a7a7a]">
            Copyright © 2026 AutoShorts AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

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
