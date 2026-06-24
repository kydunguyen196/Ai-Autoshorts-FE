import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-border bg-surface px-4",
          "text-[16px] text-foreground placeholder:text-faint",
          "leading-[1.45] transition-all duration-200",
          "hover:border-border-strong",
          "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-2/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
