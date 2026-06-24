"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/features/toast/toast-context";
import { getAuthToken, storageChangeEventName } from "@/lib/auth-storage";
import { env } from "@/lib/env";

type StreamPayload = {
  title?: string;
  message?: string;
  type?: string;
};

/**
 * Opens an SSE connection to the backend notification stream. The browser
 * EventSource API cannot send Authorization headers, so the JWT is passed as a
 * query param (the backend whitelists `/api/notifications/stream` and validates
 * the token there). On every pushed event we invalidate the notification
 * queries and surface a toast. React Query polling acts as the fallback when
 * SSE is unavailable.
 */
export function useNotificationStream(enabled: boolean) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const toastRef = useRef(toast);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    let source: EventSource | null = null;
    let closed = false;

    const connect = () => {
      const token = getAuthToken();
      if (!token) {
        return;
      }

      const url = `${env.apiBaseUrl}/api/notifications/stream?token=${encodeURIComponent(token)}`;
      source = new EventSource(url);

      const onNotification = (event: MessageEvent) => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        try {
          const payload = JSON.parse(event.data) as StreamPayload;
          const text = payload.title || payload.message;
          if (text) {
            toastRef.current.info(text);
          }
        } catch {
          // Heartbeat / non-JSON payloads are ignored.
        }
      };

      source.addEventListener("notification", onNotification as EventListener);
      source.onerror = () => {
        // EventSource auto-reconnects; nothing to do unless we tore it down.
      };
    };

    connect();

    // Reconnect when the auth token changes (login/logout in another tab).
    const onStorage = () => {
      if (closed) return;
      source?.close();
      connect();
    };
    window.addEventListener(storageChangeEventName(), onStorage);

    return () => {
      closed = true;
      window.removeEventListener(storageChangeEventName(), onStorage);
      source?.close();
    };
  }, [enabled, queryClient]);
}
