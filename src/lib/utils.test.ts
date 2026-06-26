import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";

import { formatDateTime, getErrorMessage, isTerminalJobStatus, toTitleCase } from "@/lib/utils";

describe("getErrorMessage", () => {
  it("returns the fallback for non-error input", () => {
    expect(getErrorMessage(null, "fallback")).toBe("fallback");
  });

  it("returns a plain Error message", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("flattens validation errors from an Axios error", () => {
    const error = new AxiosError("bad request");
    error.response = {
      data: { validationErrors: { name: "is required", email: "is invalid" } },
    } as never;
    expect(getErrorMessage(error)).toBe("name: is required | email: is invalid");
  });

  it("falls back to the API message when there are no validation errors", () => {
    const error = new AxiosError("network");
    error.response = { data: { message: "Server says no" } } as never;
    expect(getErrorMessage(error)).toBe("Server says no");
  });
});

describe("formatDateTime", () => {
  it("returns a dash for empty input", () => {
    expect(formatDateTime(null)).toBe("-");
    expect(formatDateTime(undefined)).toBe("-");
  });

  it("returns the raw value for an unparseable date", () => {
    expect(formatDateTime("not-a-date")).toBe("not-a-date");
  });

  it("formats a valid ISO date to a non-empty string", () => {
    expect(formatDateTime("2026-06-26T10:00:00Z")).not.toBe("-");
  });
});

describe("isTerminalJobStatus", () => {
  it("is true only for COMPLETED and FAILED", () => {
    expect(isTerminalJobStatus("COMPLETED")).toBe(true);
    expect(isTerminalJobStatus("FAILED")).toBe(true);
    expect(isTerminalJobStatus("AWAITING_REVIEW")).toBe(false);
    expect(isTerminalJobStatus("PROCESSING")).toBe(false);
    expect(isTerminalJobStatus(null)).toBe(false);
  });
});

describe("toTitleCase", () => {
  it("title-cases snake_case enum-like strings", () => {
    expect(toTitleCase("AWAITING_REVIEW")).toBe("Awaiting Review");
    expect(toTitleCase("PENDING")).toBe("Pending");
  });
});
