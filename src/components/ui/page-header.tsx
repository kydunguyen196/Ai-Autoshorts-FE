import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6",
        className,
      )}
    >
      <div>
        <p className="studio-kicker mb-3">AutoShorts AI</p>
        <h1 className="max-w-4xl text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-[16px] leading-7 text-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
