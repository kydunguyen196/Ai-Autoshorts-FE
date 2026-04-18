import { httpClient } from "@/services/http-client";
import type {
  AuthResponse,
  CurrentUserResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/api";

export async function login(payload: LoginRequest) {
  const { data } = await httpClient.post<AuthResponse>("/api/auth/login", payload);
  return data;
}

export async function register(payload: RegisterRequest) {
  const { data } = await httpClient.post<AuthResponse>("/api/auth/register", payload);
  return data;
}

export async function getCurrentUser() {
  const { data } = await httpClient.get<CurrentUserResponse>("/api/auth/me");
  return data;
}
