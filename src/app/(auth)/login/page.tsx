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
    /* Apple white card on near-black tile */
    <div className="rounded-[18px] border border-[#e0e0e0] bg-white p-8">
      {/* Eyebrow */}
      <p className="text-[12px] font-normal tracking-[-0.12px] text-[#0066cc]">AutoShorts AI</p>

      <h1 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-[-0.374px] text-[#1d1d1f]">
        Sign in.
      </h1>
      <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-[#7a7a7a]">
        Continue building your AI video pipeline.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-1.5">
          <span className="text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f]">Email</span>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@creator.com"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f]">Password</span>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        {error ? (
          <p className="rounded-[11px] border border-[#ff3b30]/40 bg-[#ff3b30]/08 px-4 py-2.5 text-[14px] tracking-[-0.224px] text-[#c0392b]">
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

      <p className="mt-6 text-[14px] tracking-[-0.224px] text-[#7a7a7a]">
        New here?{" "}
        <Link className="text-[#0066cc] hover:underline" href="/register">
          Create account
        </Link>
      </p>
    </div>
  );
}
