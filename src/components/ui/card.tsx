import { cn } from "@/lib/utils";

/**
 * Apple store-utility-card:
 * white canvas, 1px hairline border, 18px radius, 24px padding.
 * No shadow on the card itself — shadow is reserved for product imagery.
 */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-[#e0e0e0] bg-white p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
