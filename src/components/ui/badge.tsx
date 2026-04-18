import { cn, toTitleCase } from "@/lib/utils";

const intentStyles = {
  neutral: "border-zinc-700 bg-zinc-900/60 text-zinc-300",
  success: "border-emerald-700/50 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-700/50 bg-amber-500/10 text-amber-300",
  danger: "border-red-700/50 bg-red-500/10 text-red-300",
  info: "border-indigo-700/50 bg-indigo-500/10 text-indigo-200",
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
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        intentStyles[intent],
        className,
      )}
    >
      {transform ? toTitleCase(children) : children}
    </span>
  );
}
