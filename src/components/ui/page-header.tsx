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
    <div className={cn("mb-6 flex flex-wrap items-start justify-between gap-4", className)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl">{title}</h1>
        {description ? <p className="mt-2 text-sm text-zinc-400">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
