import { forwardRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Apple search-input style:
 * white bg, 1px rgba(0,0,0,0.08) border, pill radius, 17px text.
 */
export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-5",
          "text-[17px] text-[#1d1d1f] placeholder:text-[#7a7a7a]",
          "tracking-[-0.374px] leading-[1.47]",
          "focus:outline-2 focus:outline-[#0071e3] focus:outline-offset-0",
          "transition-shadow duration-150",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
