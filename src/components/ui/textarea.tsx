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
        "min-h-[112px] w-full rounded-none border border-[#d8d0c1] bg-[#fffaf0] px-4 py-3",
        "text-[16px] text-[#11100e] placeholder:text-[#9a948b]",
        "leading-[1.45] resize-y transition-colors duration-150",
        "focus:border-[#11100e] focus:outline-2 focus:outline-[#4b6fff] focus:outline-offset-0",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
