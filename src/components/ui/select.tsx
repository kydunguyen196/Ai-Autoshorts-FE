import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-5",
          "text-[17px] text-[#1d1d1f] tracking-[-0.374px]",
          "focus:outline-2 focus:outline-[#0071e3] focus:outline-offset-0",
          "appearance-none cursor-pointer",
          className,
        )}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";
