"use client";

import { useEffect, useMemo, useRef } from "react";
import { animate, stagger } from "animejs";

type AnimatedTextProps = {
  text: string;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
  delay?: number;
  by?: "char" | "word";
};

export function AnimatedText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  by = "char",
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const Component = Tag as React.ElementType;
  const wordParts = useMemo(() => text.split(" "), [text]);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animation = animate(root.querySelectorAll("[data-text-part]"), {
      opacity: [0, 1],
      y: [22, 0],
      rotateX: [-28, 0],
      filter: ["blur(10px)", "blur(0px)"],
      delay: stagger(by === "word" ? 48 : 15, { start: delay }),
      duration: 760,
      ease: "outExpo",
    });

    return () => {
      animation.cancel();
    };
  }, [by, delay, text]);

  return (
    <Component ref={ref} className={className}>
      {by === "word"
        ? wordParts.map((word, index) => (
            <span
              aria-hidden="true"
              className="inline-block whitespace-nowrap pr-[0.24em] will-change-transform"
              data-text-part
              key={`${word}-${index}`}
            >
              {word}
            </span>
          ))
        : wordParts.map((word, wordIndex) => (
            <span
              aria-hidden="true"
              className="inline-block whitespace-nowrap pr-[0.24em]"
              key={`${word}-${wordIndex}`}
            >
              {Array.from(word).map((char, charIndex) => (
                <span
                  className="inline-block will-change-transform"
                  data-text-part
                  key={`${char}-${wordIndex}-${charIndex}`}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
      <span className="sr-only">{text}</span>
    </Component>
  );
}
