import { cn, toTitleCase } from "@/lib/utils";

/**
 * Apple configurator-option-chip style badges.
 * Pill shape, 14px caption text, hairline border.
 */
const intentStyles = {
  neutral: "border-[#e0e0e0] bg-[#f5f5f7] text-[#1d1d1f]",
  success: "border-[#34c759]/40 bg-[#34c759]/10 text-[#1a7f37]",
  warning: "border-[#ff9500]/40 bg-[#ff9500]/10 text-[#7d4e00]",
  danger:  "border-[#ff3b30]/40 bg-[#ff3b30]/10 text-[#c0392b]",
  info:    "border-[#0066cc]/30 bg-[#0066cc]/08 text-[#0066cc]",
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
        "text-[14px] font-normal tracking-[-0.224px]",
        intentStyles[intent],
        className,
      )}
    >
      {transform ? toTitleCase(children) : children}
    </span>
  );
}
