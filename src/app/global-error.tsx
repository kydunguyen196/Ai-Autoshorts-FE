"use client";

// Catches errors thrown in the root layout itself. Must render its own <html>/<body>.
import { useEffect } from "react";

import { reportError } from "@/lib/report-error";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, { boundary: "app/global-error", digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, sans-serif",
          background: "#0a0a0a",
          color: "#fafafa",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Ứng dụng gặp sự cố</h1>
        <p style={{ maxWidth: "28rem", fontSize: "0.875rem", color: "#a1a1aa" }}>
          Đã xảy ra lỗi nghiêm trọng. Vui lòng tải lại trang.
        </p>
        <button
          onClick={() => reset()}
          style={{
            height: "2.75rem",
            padding: "0 1.5rem",
            borderRadius: "9999px",
            border: "none",
            background: "#6366f1",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Thử lại
        </button>
      </body>
    </html>
  );
}
