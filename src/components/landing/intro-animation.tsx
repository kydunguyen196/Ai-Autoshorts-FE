"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createTimeline, stagger } from "animejs";

export function IntroAnimation() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const title = "AutoShorts AI";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeline = createTimeline({
      onComplete: () => setVisible(false),
    })
      .add(root.querySelectorAll("[data-intro-char]"), {
        opacity: [0, 1],
        y: [18, 0],
        filter: ["blur(12px)", "blur(0px)"],
        delay: stagger(34),
        duration: 620,
        ease: "outExpo",
      })
      .add(
        root.querySelectorAll("[data-intro-line]"),
        {
          strokeDashoffset: [420, 0],
          opacity: [0.15, 1],
          duration: 760,
          ease: "inOutSine",
        },
        "-=420",
      )
      .add(
        root,
        {
          opacity: [1, 0],
          scale: [1, 1.03],
          duration: 520,
          ease: "inOutQuad",
        },
        "+=350",
      );

    const pulse = animate(root.querySelectorAll("[data-intro-pulse]"), {
      opacity: [0.28, 0.82],
      scale: [0.92, 1.12],
      duration: 820,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });

    return () => {
      timeline.cancel();
      pulse.cancel();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#f6f0e5] text-[#11100e]"
      ref={rootRef}
    >
      <div className="absolute inset-0 landing-grid opacity-50" />
      <svg className="absolute h-[46vmin] w-[46vmin] text-[#11100e]/45" viewBox="0 0 420 420">
        <path
          d="M34 210 C96 78 305 72 378 210 C305 349 96 342 34 210Z"
          data-intro-line
          fill="none"
          pathLength="420"
          stroke="currentColor"
          strokeDasharray="420"
          strokeDashoffset="420"
          strokeWidth="1"
        />
        <path
          d="M210 34 C320 93 330 314 210 386 C91 315 91 94 210 34Z"
          data-intro-line
          fill="none"
          pathLength="420"
          stroke="currentColor"
          strokeDasharray="420"
          strokeDashoffset="420"
          strokeWidth="1"
        />
      </svg>
      <div data-intro-pulse className="absolute h-48 w-48 rounded-full border border-[#11100e]/20 blur-[1px]" />
      <div className="relative text-center">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.46em] text-[#686157]">
          please wait experience loading
        </p>
        <div className="text-4xl font-semibold tracking-[0.08em] text-[#11100e] md:text-6xl">
          {Array.from(title).map((char, index) => (
            <span className="inline-block" data-intro-char key={`${char}-${index}`}>
              {char === " " ? "\u00a0" : char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
