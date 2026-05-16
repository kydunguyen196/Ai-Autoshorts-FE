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
        "min-h-[96px] w-full rounded-[18px] border border-[rgba(0,0,0,0.08)] bg-white px-5 py-3",
        "text-[17px] text-[#1d1d1f] placeholder:text-[#7a7a7a]",
        "tracking-[-0.374px] leading-[1.47]",
        "focus:outline-2 focus:outline-[#0071e3] focus:outline-offset-0",
        "resize-y transition-shadow duration-150",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
