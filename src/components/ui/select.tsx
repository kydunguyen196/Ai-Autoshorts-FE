import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full cursor-pointer appearance-none rounded-none border border-[#d8d0c1] bg-[#fffaf0] px-4",
          "text-[16px] text-[#11100e]",
          "focus:border-[#11100e] focus:outline-2 focus:outline-[#4b6fff] focus:outline-offset-0",
          className,
        )}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";
