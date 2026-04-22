import { Badge } from "@/components/ui/badge";
import type { ReviewStatus } from "@/types/api";

export function ReviewStatusBadge({ status }: { status?: ReviewStatus | null }) {
  if (!status) {
    return <Badge intent="neutral">UNKNOWN</Badge>;
  }

  if (status === "APPROVED") {
    return <Badge intent="success">{status}</Badge>;
  }

  if (status === "REJECTED") {
    return <Badge intent="danger">{status}</Badge>;
  }

  if (status === "GENERATED") {
    return <Badge intent="info">{status}</Badge>;
  }

  return <Badge intent="warning">{status}</Badge>;
}
