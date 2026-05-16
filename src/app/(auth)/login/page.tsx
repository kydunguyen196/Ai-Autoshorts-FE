"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/use-auth";
import { getErrorMessage } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isHydrated } = useAuth();
  const [nextPath, setNextPath] = useState("/app");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isHydrated && isAuthenticated) router.replace("/app");
  }, [isHydrated, isAuthenticated, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next") || "/app");
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      router.replace(nextPath);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to sign in"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="studio-card p-8">
      <p className="studio-kicker">AutoShorts AI</p>

      <h1 className="mt-5 text-[48px] font-semibold leading-[0.92] text-[#11100e]">
        Sign in.
      </h1>
      <p className="mt-4 text-[16px] leading-7 text-[#686157]">
        Continue building your AI video pipeline.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#686157]">Email</span>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@creator.com"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#686157]">Password</span>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        {error ? (
          <p className="border border-[#b42318]/30 bg-[#b42318]/10 px-4 py-2.5 text-[14px] text-[#b42318]">
            {error}
          </p>
        ) : null}

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Spinner className="h-4 w-4 border-white border-r-transparent" /> Signing in…
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <p className="mt-6 text-[14px] text-[#686157]">
        New here?{" "}
        <Link className="font-medium text-[#11100e] underline decoration-[#c9ff4a] decoration-4 underline-offset-4" href="/register">
          Create account
        </Link>
      </p>
    </div>
  );
}
