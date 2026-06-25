"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { reportError } from "@/lib/report-error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { boundary: "app/error", digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Đã xảy ra lỗi</h1>
      <p className="max-w-md text-sm text-muted">
        Rất tiếc, đã có sự cố khi tải trang này. Bạn có thể thử lại hoặc tải lại trang.
      </p>
      {error.digest ? (
        <p className="text-xs text-muted">Mã lỗi: {error.digest}</p>
      ) : null}
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Thử lại</Button>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Tải lại trang
        </Button>
      </div>
    </div>
  );
}
