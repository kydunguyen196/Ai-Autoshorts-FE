import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

/**
 * Apple design system buttons.
 *
 * primary   — Action Blue pill (#0066cc), rounded-full, the signature CTA
 * secondary — Pearl capsule with hairline border, rounded-full
 * ghost     — Text-only, dark utility rect (rounded-sm)
 * danger    — Red destructive action
 */
const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[#0066cc] text-white rounded-full hover:bg-[#0077ed] active:scale-95 focus-visible:outline-[#0071e3]",
  secondary:
    "bg-[#fafafc] text-[#333333] border border-[#e0e0e0] rounded-full hover:bg-[#f0f0f2] active:scale-95",
  ghost:
    "bg-[#1d1d1f] text-white rounded-[8px] hover:bg-[#2d2d2f] active:scale-95",
  danger:
    "bg-[#ff3b30] text-white rounded-full hover:bg-[#ff2d20] active:scale-95",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-[15px] text-[14px] tracking-[-0.224px]",
  md: "h-[44px] px-[22px] text-[17px]",
  lg: "h-[52px] px-[28px] text-[18px] font-light",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "btn-press inline-flex items-center justify-center font-normal transition-all duration-150",
          "disabled:cursor-not-allowed disabled:opacity-40",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
