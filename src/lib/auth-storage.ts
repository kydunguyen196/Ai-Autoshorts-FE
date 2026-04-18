const AUTH_TOKEN_KEY = "autoshorts.auth.token";
const ACTIVE_CHANNEL_KEY = "autoshorts.active.channel";
const STORAGE_EVENT_NAME = "autoshorts-storage";

function isBrowser() {
  return typeof window !== "undefined";
}

function notifyStorageChange() {
  if (!isBrowser()) {
    return;
  }
  window.dispatchEvent(new Event(STORAGE_EVENT_NAME));
}

export function storageChangeEventName() {
  return STORAGE_EVENT_NAME;
}

export function getAuthToken(): string | null {
  if (!isBrowser()) {
    return null;
  }
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  notifyStorageChange();
}

export function clearAuthToken() {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  notifyStorageChange();
}

export function getActiveChannelId(): string | null {
  if (!isBrowser()) {
    return null;
  }
  return window.localStorage.getItem(ACTIVE_CHANNEL_KEY);
}

export function setActiveChannelId(channelId: string) {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(ACTIVE_CHANNEL_KEY, channelId);
  notifyStorageChange();
}

export function clearActiveChannelId() {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.removeItem(ACTIVE_CHANNEL_KEY);
  notifyStorageChange();
}
