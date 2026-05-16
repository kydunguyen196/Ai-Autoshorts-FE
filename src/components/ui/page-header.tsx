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
    <div className={cn("mb-8 flex flex-wrap items-start justify-between gap-4", className)}>
      <div>
        <h1 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-[#1d1d1f]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-[#7a7a7a]">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
