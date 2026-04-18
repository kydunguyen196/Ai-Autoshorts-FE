import { Badge } from "@/components/ui/badge";
import type { JobStatus } from "@/types/api";

export function JobStatusBadge({ status }: { status: JobStatus }) {
  if (status === "COMPLETED") {
    return <Badge intent="success">{status}</Badge>;
  }

  if (status === "FAILED") {
    return <Badge intent="danger">{status}</Badge>;
  }

  if (status === "PROCESSING") {
    return <Badge intent="info">{status}</Badge>;
  }

  return <Badge intent="warning">{status}</Badge>;
}
