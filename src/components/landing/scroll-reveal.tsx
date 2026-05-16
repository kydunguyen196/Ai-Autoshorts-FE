"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: boolean;
};

export function ScrollReveal({ children, className, staggerChildren = false }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = staggerChildren ? node.querySelectorAll("[data-reveal-item]") : node;
    let animation: ReturnType<typeof animate> | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || animation) return;
        animation = animate(targets, {
          opacity: [0, 1],
          y: [34, 0],
          filter: ["blur(12px)", "blur(0px)"],
          delay: staggerChildren ? stagger(90) : 0,
          duration: 850,
          ease: "outCubic",
        });
        observer.disconnect();
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      animation?.cancel();
    };
  }, [staggerChildren]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}
