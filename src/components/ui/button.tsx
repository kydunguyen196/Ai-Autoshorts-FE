import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-accent text-on-accent rounded-full hover:brightness-105 hover:-translate-y-px hover:glow-accent",
  secondary:
    "bg-surface text-foreground border border-border rounded-full hover:border-accent hover:text-foreground",
  ghost:
    "bg-transparent text-muted border border-border rounded-full hover:border-foreground hover:text-foreground hover:bg-surface",
  danger:
    "bg-danger text-on-dark rounded-full hover:bg-danger-strong",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-4 text-[14px]",
  md: "h-11 px-6 text-[16px]",
  lg: "h-[52px] px-7 text-[18px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "btn-press inline-flex items-center justify-center gap-2 font-medium",
          "transition-all duration-200 ease-out",
          "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0",
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
