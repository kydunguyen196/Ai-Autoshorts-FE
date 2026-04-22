import { Badge } from "@/components/ui/badge";
import type { PublishStatus } from "@/types/api";

export function PublishStatusBadge({ status }: { status?: PublishStatus | null }) {
  if (!status) {
    return <Badge intent="neutral">UNKNOWN</Badge>;
  }

  if (status === "PUBLISHED") {
    return <Badge intent="success">{status}</Badge>;
  }

  if (status === "PUBLISH_FAILED") {
    return <Badge intent="danger">{status}</Badge>;
  }

  if (status === "PUBLISHING") {
    return <Badge intent="info">{status}</Badge>;
  }

  if (status === "READY_TO_PUBLISH") {
    return <Badge intent="warning">{status}</Badge>;
  }

  return <Badge intent="neutral">{status}</Badge>;
}
