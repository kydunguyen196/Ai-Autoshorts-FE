"use client";

import { useEffect, useRef } from "react";
import { animate, createTimeline, stagger } from "animejs";

export function TechVisual() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeline = createTimeline({ loop: true })
      .add(svg.querySelectorAll("[data-draw]"), {
        strokeDashoffset: [520, 0],
        opacity: [0.1, 0.9],
        delay: stagger(120),
        duration: 1700,
        ease: "inOutSine",
      })
      .add(
        svg.querySelectorAll("[data-node]"),
        {
          opacity: [0.22, 1],
          scale: [0.72, 1],
          transformOrigin: "center",
          delay: stagger(70, { from: "center" }),
          duration: 620,
          ease: "outBack",
        },
        "-=950",
      )
      .add(
        svg.querySelectorAll("[data-scan]"),
        {
          translateX: [-180, 180],
          opacity: [0, 1, 0],
          duration: 1600,
          ease: "inOutQuad",
        },
        "-=450",
      );

    const orbit = animate(svg.querySelectorAll("[data-orbit]"), {
      rotate: "1turn",
      transformOrigin: "260px 220px",
      duration: 18000,
      ease: "linear",
      loop: true,
    });

    return () => {
      timeline.cancel();
      orbit.cancel();
    };
  }, []);

  return (
    <svg
      ref={ref}
      className="tech-visual h-full min-h-[300px] w-full overflow-visible"
      role="img"
      viewBox="0 0 520 440"
      aria-label="Abstract AI video pipeline visual"
    >
      <defs>
        <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="52%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g data-orbit opacity="0.7">
        <ellipse cx="260" cy="220" fill="none" rx="178" ry="88" stroke="#67e8f9" strokeOpacity="0.18" />
        <ellipse
          cx="260"
          cy="220"
          fill="none"
          rx="108"
          ry="190"
          stroke="#c084fc"
          strokeOpacity="0.16"
          transform="rotate(24 260 220)"
        />
      </g>

      <path
        d="M82 264 C132 156 196 140 260 212 C318 278 384 254 438 132"
        data-draw
        fill="none"
        pathLength="520"
        stroke="url(#lineGradient)"
        strokeDasharray="520"
        strokeDashoffset="520"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M96 132 L168 132 L210 184 L304 184 L356 236 L432 236"
        data-draw
        fill="none"
        pathLength="520"
        stroke="#67e8f9"
        strokeDasharray="520"
        strokeDashoffset="520"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.75"
        strokeWidth="1.4"
      />
      <path
        d="M118 316 H196 L238 276 H306 L354 316 H428"
        data-draw
        fill="none"
        pathLength="520"
        stroke="#34d399"
        strokeDasharray="520"
        strokeDashoffset="520"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.65"
        strokeWidth="1.4"
      />

      <g filter="url(#softGlow)">
        {[
          [96, 132],
          [168, 132],
          [210, 184],
          [304, 184],
          [356, 236],
          [432, 236],
          [118, 316],
          [238, 276],
          [354, 316],
          [438, 132],
        ].map(([cx, cy]) => (
          <circle cx={cx} cy={cy} data-node fill="#f8fafc" key={`${cx}-${cy}`} r="4.5" />
        ))}
      </g>

      <rect data-scan fill="#67e8f9" height="250" opacity="0" rx="18" width="26" x="247" y="95" />
      <rect
        fill="none"
        height="260"
        rx="28"
        stroke="white"
        strokeOpacity="0.12"
        width="360"
        x="80"
        y="90"
      />
    </svg>
  );
}
