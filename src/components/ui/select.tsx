import { forwardRef } from "react";

import { cn } from "@/lib/utils";

// Inline chevron as a background image so <select> stays the root element
// (preserves existing layout/width behaviour at every call site).
const chevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none' stroke='%23999' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, style, ...props }, ref) => {
    return (
      <select
        ref={ref}
        style={{
          backgroundImage: chevron,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
          ...style,
        }}
        className={cn(
          "h-11 w-full cursor-pointer appearance-none rounded-xl border border-border bg-surface px-4 pr-10",
          "text-[16px] text-foreground transition-all duration-200",
          "hover:border-border-strong",
          "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-2/40",
          className,
        )}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";
