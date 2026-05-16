import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[#11100e] text-[#fffaf0] rounded-full hover:bg-[#2b2924] focus-visible:outline-[#4b6fff]",
  secondary:
    "bg-[#fffaf0] text-[#11100e] border border-[#11100e] rounded-full hover:bg-[#c9ff4a]",
  ghost:
    "bg-transparent text-[#11100e] border border-[#d8d0c1] rounded-full hover:border-[#11100e] hover:bg-[#fffaf0]",
  danger:
    "bg-[#b42318] text-white rounded-full hover:bg-[#8f1c14]",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-[15px] text-[14px] ",
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
          "btn-press inline-flex items-center justify-center font-medium transition-all duration-150",
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
