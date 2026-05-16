import { cn, toTitleCase } from "@/lib/utils";

/**
 * Apple configurator-option-chip style badges.
 * Pill shape, 14px caption text, hairline border.
 */
const intentStyles = {
  neutral: "border-[#d8d0c1] bg-[#fffaf0] text-[#11100e]",
  success: "border-[#126b42]/30 bg-[#126b42]/10 text-[#126b42]",
  warning: "border-[#8a5a00]/30 bg-[#c9ff4a]/25 text-[#5d4100]",
  danger: "border-[#b42318]/30 bg-[#b42318]/10 text-[#b42318]",
  info: "border-[#4b6fff]/30 bg-[#4b6fff]/10 text-[#243fbd]",
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
