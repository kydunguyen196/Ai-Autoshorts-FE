import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-none border border-[#d8d0c1] bg-[#fffaf0] px-4",
          "text-[16px] text-[#11100e] placeholder:text-[#9a948b]",
          "leading-[1.45] transition-colors duration-150",
          "focus:border-[#11100e] focus:outline-2 focus:outline-[#4b6fff] focus:outline-offset-0",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
