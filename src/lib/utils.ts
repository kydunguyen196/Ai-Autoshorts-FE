import { clsx, type ClassValue } from "clsx";
import { AxiosError } from "axios";
import { twMerge } from "tailwind-merge";

import type { ApiErrorResponse } from "@/types/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.validationErrors && Object.keys(data.validationErrors).length > 0) {
      return Object.entries(data.validationErrors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(" | ");
    }
    return data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function isTerminalJobStatus(status?: string | null) {
  return status === "COMPLETED" || status === "FAILED";
}

export function toTitleCase(input: string) {
  return input
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
