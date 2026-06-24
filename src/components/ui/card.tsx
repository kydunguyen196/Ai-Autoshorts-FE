import { cn } from "@/lib/utils";

export function Card({
  className,
  interactive = false,
  children,
}: {
  className?: string;
  /** Adds hover-lift + sheen affordance for clickable cards. */
  interactive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("studio-card p-6", interactive && "card-hover cursor-pointer", className)}>
      {children}
    </div>
  );
}
