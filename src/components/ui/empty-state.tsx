import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("py-12 text-center", className)}>
      <h3 className="text-[24px] font-semibold leading-tight text-[#11100e]">{title}</h3>
      <p className="mt-2 text-[16px] text-[#686157]">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </Card>
  );
}
