"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Boxes,
  Clapperboard,
  Film,
  Layers3,
  Play,
  RadioTower,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import { animate } from "animejs";

import { AnimatedText } from "@/components/landing/animated-text";
import { IntroAnimation } from "@/components/landing/intro-animation";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { TechVisual } from "@/components/landing/tech-visual";

const navItems = [
  { label: "System", href: "#system" },
  { label: "Studio", href: "#studio" },
  { label: "Gallery", href: "#gallery" },
  { label: "Launch", href: "#launch" },
];

const productPillars = [
  {
    title: "Queue-backed generation",
    description: "Batch and single-video requests move through a durable worker flow with clear job state.",
    icon: Bot,
  },
  {
    title: "Creative command center",
    description: "Topics, characters, campaigns, channels, publishing status, and reviews stay in one workspace.",
    icon: WandSparkles,
  },
  {
    title: "Creator-ready assets",
    description: "Track scripts, subtitles, metadata, media assets, and final outputs from the same production surface.",
    icon: Film,
  },
];

const showcase = [
  { label: "Generation API", value: "Prompt to video", icon: Sparkles },
  { label: "RabbitMQ queue", value: "Background jobs", icon: RadioTower },
  { label: "Step lifecycle", value: "Traceable progress", icon: Layers3 },
  { label: "Media delivery", value: "Preview and export", icon: Play },
];

const gallery = [
  {
    title: "Topic Observatory",
    copy: "Curate idea pools and keep the content engine fed without losing editorial control.",
    stat: "24/7",
  },
  {
    title: "Character Studio",
    copy: "Reusable personalities and campaign context create a consistent channel voice.",
    stat: "Voice",
  },
  {
    title: "Publish Console",
    copy: "Review readiness, metadata, and publishing state before a video leaves the studio.",
    stat: "Ready",
  },
];

export function LandingExperience() {
  return (
    <main className="landing-surface min-h-screen overflow-hidden bg-[#030305] text-white">
      <IntroAnimation />
      <FloatingNav />
      <HeroSection />
      <ProductSection />
      <TechShowcase />
      <FeatureGallery />
      <FinalCta />
      <Footer />
    </main>
  );
}

function FloatingNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4 md:px-8">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[#07070a]/70 px-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:px-6">
        <Link className="group flex items-center gap-3" href="/">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-cyan-200/30 bg-white/[0.06] text-cyan-100">
            <Clapperboard className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-[0.18em] text-white">AUTOSHORTS</span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              className="landing-nav-link text-[12px] uppercase tracking-[0.26em] text-white/58 transition-colors hover:text-white"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link className="hidden text-sm text-white/68 transition hover:text-white sm:inline-flex" href="/login">
            Sign in
          </Link>
          <Link className="landing-button landing-button-compact" href="/register">
            Begin
          </Link>
        </div>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative flex min-h-[94svh] items-center px-5 pb-12 pt-28 md:px-8">
      <div className="absolute inset-0 landing-grid" />
      <div className="absolute inset-0 landing-aurora" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#030305] to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.12fr_0.88fr]">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-emerald-200/20 bg-emerald-300/[0.06] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-100/80">
            Digital Art Museum for AI video operations
          </p>
          <AnimatedText
            as="h1"
            className="max-w-5xl text-[clamp(2.75rem,6.4vw,5.2rem)] font-semibold leading-[0.94] text-white"
            delay={2050}
            text="Automate short-form video like a cinematic system."
          />
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/66 md:text-xl">
            AutoShorts AI turns topics, characters, batches, and publishing checks into a premium creator
            pipeline with step-level visibility.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MagneticLink href="/register">Enter the studio</MagneticLink>
            <Link className="landing-button-secondary" href="/login">
              Open dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[420px]">
          <div className="absolute inset-0 rounded-[3rem] border border-white/10 bg-white/[0.035] shadow-[0_40px_160px_rgba(26,227,255,0.10)] backdrop-blur-xl" />
          <div className="absolute inset-4 rounded-[2.5rem] border border-white/[0.08] bg-[#050507]/72" />
          <div className="absolute left-6 right-6 top-6 z-10 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-4 py-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/48">live render graph</span>
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
          </div>
          <div className="absolute inset-x-5 bottom-6 z-10 grid gap-3 sm:grid-cols-3">
            {["Script", "Voice", "Render"].map((step, index) => (
              <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4" key={step}>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-100/48">
                  0{index + 1}
                </p>
                <p className="mt-2 text-sm text-white/82">{step}</p>
              </div>
            ))}
          </div>
          <TechVisual />
        </div>
      </div>
    </section>
  );
}

function ProductSection() {
  return (
    <section className="relative px-5 py-24 md:px-8" id="system">
      <ScrollReveal className="mx-auto max-w-7xl" staggerChildren>
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div data-reveal-item>
            <p className="landing-kicker">Product system</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
              A gallery-grade interface around real automation.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {productPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <InteractiveCard className="landing-card p-6" key={pillar.title}>
                  <Icon className="h-6 w-6 text-cyan-100" />
                  <h3 className="mt-8 text-xl font-semibold">{pillar.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/58">{pillar.description}</p>
                </InteractiveCard>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function TechShowcase() {
  return (
    <section className="relative px-5 py-24 md:px-8" id="studio">
      <ScrollReveal className="mx-auto max-w-7xl" staggerChildren>
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl md:p-8">
          <div className="grid items-end gap-8 border-b border-white/10 pb-8 md:grid-cols-[1fr_auto]">
            <div data-reveal-item>
              <p className="landing-kicker">Technology showcase</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
                Pipeline telemetry, rendered as a creative control room.
              </h2>
            </div>
            <div className="hidden rounded-full border border-white/10 bg-black/20 px-5 py-3 font-mono text-xs uppercase tracking-[0.28em] text-white/44 md:block">
              low-latency motion
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {showcase.map((item) => {
              const Icon = item.icon;
              return (
                <InteractiveCard className="landing-card p-5" key={item.label}>
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-emerald-100" />
                    <Zap className="h-4 w-4 text-fuchsia-100/60" />
                  </div>
                  <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.26em] text-white/42">
                    {item.label}
                  </p>
                  <p className="mt-3 text-lg font-medium">{item.value}</p>
                </InteractiveCard>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function FeatureGallery() {
  return (
    <section className="px-5 py-24 md:px-8" id="gallery">
      <ScrollReveal className="mx-auto max-w-7xl" staggerChildren>
        <div data-reveal-item className="max-w-3xl">
          <p className="landing-kicker">Feature gallery</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            Every station has a purpose.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {gallery.map((item, index) => (
            <InteractiveCard className="landing-gallery-card min-h-[360px] p-7" key={item.title}>
              <div className="flex items-start justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
                  Exhibit 0{index + 1}
                </span>
                <Boxes className="h-5 w-5 text-cyan-100/70" />
              </div>
              <div className="mt-24">
                <p className="font-mono text-4xl text-white/90">{item.stat}</p>
                <h3 className="mt-6 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/58">{item.copy}</p>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-5 py-24 md:px-8" id="launch">
      <ScrollReveal className="mx-auto max-w-5xl text-center">
        <p className="landing-kicker justify-center">Launch room</p>
        <AnimatedText
          as="h2"
          by="word"
          className="mt-5 block text-4xl font-semibold leading-tight md:text-7xl"
          text="Build the next channel from a system that feels alive."
        />
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/62">
          Start with the public studio, then continue into the existing dashboard without changing the auth or
          API flow.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <MagneticLink href="/register">Create account</MagneticLink>
          <Link className="landing-button-secondary" href="/login">
            Sign in <ShieldCheck className="h-4 w-4" />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/42 md:flex-row md:items-center md:justify-between">
        <p>Copyright 2026 AutoShorts AI. All rights reserved.</p>
        <div className="flex gap-5">
          <Link className="transition hover:text-white" href="/login">
            Dashboard
          </Link>
          <Link className="transition hover:text-white" href="/register">
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
}

function InteractiveCard({ children, className }: { children: React.ReactNode; className: string }) {
  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    animate(card, {
      rotateY: x / 28,
      rotateX: -y / 32,
      translateY: -5,
      duration: 420,
      ease: "outCubic",
    });
  }

  function handleLeave(event: React.MouseEvent<HTMLDivElement>) {
    animate(event.currentTarget, {
      rotateY: 0,
      rotateX: 0,
      translateY: 0,
      duration: 520,
      ease: "outElastic(1, .7)",
    });
  }

  return (
    <div className={className} data-reveal-item onMouseLeave={handleLeave} onMouseMove={handleMove}>
      {children}
    </div>
  );
}

function MagneticLink({ children, href }: { children: React.ReactNode; href: string }) {
  function handleMove(event: React.MouseEvent<HTMLAnchorElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    animate(button, {
      translateX: (event.clientX - rect.left - rect.width / 2) * 0.16,
      translateY: (event.clientY - rect.top - rect.height / 2) * 0.22,
      duration: 320,
      ease: "outCubic",
    });
  }

  function handleLeave(event: React.MouseEvent<HTMLAnchorElement>) {
    animate(event.currentTarget, {
      translateX: 0,
      translateY: 0,
      duration: 520,
      ease: "outElastic(1, .7)",
    });
  }

  return (
    <Link className="landing-button" href={href} onMouseLeave={handleLeave} onMouseMove={handleMove}>
      <span>{children}</span>
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
