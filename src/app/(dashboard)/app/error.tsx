"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { reportError } from "@/lib/report-error";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { boundary: "dashboard/error", digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface px-6 py-12 text-center">
      <h2 className="text-xl font-semibold text-foreground">Không tải được nội dung</h2>
      <p className="max-w-md text-sm text-muted">
        Đã có lỗi khi hiển thị phần này của bảng điều khiển. Thử lại hoặc quay về trang chủ.
      </p>
      {error.digest ? <p className="text-xs text-muted">Mã lỗi: {error.digest}</p> : null}
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Thử lại</Button>
        <Button variant="secondary" onClick={() => (window.location.href = "/app")}>
          Về trang chủ
        </Button>
      </div>
    </div>
  );
}
