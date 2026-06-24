import { cn, toTitleCase } from "@/lib/utils";

/**
 * Pill-shaped status chip with a hairline border and tinted background.
 * Colours are theme-aware via semantic tokens.
 */
const intentStyles = {
  neutral: "border-border bg-surface text-strong",
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/15 text-warning-strong",
  danger: "border-danger/40 bg-danger/10 text-danger",
  info: "border-accent-2/40 bg-accent-2/10 text-info",
  accent: "border-accent/50 bg-accent/15 text-foreground",
} as const;

export function Badge({
  children,
  className,
  intent = "neutral",
  transform = false,
}: {
  children: string;
  className?: string;
  intent?: keyof typeof intentStyles;
  transform?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-[10px] py-[4px]",
        "font-mono text-[11px] font-normal uppercase tracking-[0.18em]",
        intentStyles[intent],
        className,
      )}
    >
      {transform ? toTitleCase(children) : children}
    </span>
  );
}
