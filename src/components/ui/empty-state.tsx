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
      <h3 className="text-[21px] font-semibold tracking-[-0.374px] text-[#1d1d1f]">{title}</h3>
      <p className="mt-2 text-[17px] text-[#7a7a7a] tracking-[-0.374px]">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </Card>
  );
}
