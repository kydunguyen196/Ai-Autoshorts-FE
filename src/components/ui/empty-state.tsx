import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "studio-card flex flex-col items-center px-6 py-14 text-center",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-accent/10 text-accent"
      >
        {icon ?? <Dot />}
      </span>
      <h3 className="mt-5 text-[22px] font-semibold leading-tight text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-[15px] leading-6 text-muted">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

function Dot() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="0.6" fill="currentColor" />
    </svg>
  );
}
