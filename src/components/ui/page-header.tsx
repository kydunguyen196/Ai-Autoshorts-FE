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
    <div className={cn("mb-8 border-b border-[#11100e] pb-6 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <p className="studio-kicker mb-3">AutoShorts AI</p>
        <h1 className="max-w-4xl text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.95] text-[#11100e]">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[#686157]">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
