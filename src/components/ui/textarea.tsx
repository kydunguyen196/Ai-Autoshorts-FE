import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[112px] w-full rounded-xl border border-border bg-surface px-4 py-3",
        "text-[16px] text-foreground placeholder:text-faint",
        "leading-[1.5] resize-y transition-all duration-200",
        "hover:border-border-strong",
        "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-2/40",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
