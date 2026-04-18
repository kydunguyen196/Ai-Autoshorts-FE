import { Button } from "@/components/ui/button";

export function PaginationControls({
  page,
  totalPages,
  hasPrevious,
  hasNext,
  onChange,
}: {
  page: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onChange: (nextPage: number) => void;
}) {
  return (
    <div className="mt-5 flex items-center justify-between gap-3 text-sm text-zinc-400">
      <p>
        Page {page + 1} {totalPages > 0 ? `of ${totalPages}` : ""}
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={!hasPrevious} onClick={() => onChange(page - 1)}>
          Previous
        </Button>
        <Button variant="secondary" size="sm" disabled={!hasNext} onClick={() => onChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
