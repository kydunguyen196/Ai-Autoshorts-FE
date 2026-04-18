import { Badge } from "@/components/ui/badge";

export function JobStepBadge({ step }: { step?: string | null }) {
  if (!step) {
    return <Badge intent="neutral">UNKNOWN</Badge>;
  }

  return (
    <Badge intent={step === "COMPLETED" ? "success" : "info"} transform>
      {step}
    </Badge>
  );
}
