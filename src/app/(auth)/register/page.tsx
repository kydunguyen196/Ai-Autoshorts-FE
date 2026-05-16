"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/use-auth";
import { getErrorMessage } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isHydrated } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isHydrated && isAuthenticated) router.replace("/app");
  }, [isHydrated, isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ displayName, email, password });
      router.replace("/app");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create account"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="studio-card p-8">
      <p className="studio-kicker">AutoShorts AI</p>

      <h1 className="mt-5 text-[48px] font-semibold leading-[0.92] text-[#11100e]">
        Create your workspace.
      </h1>
      <p className="mt-4 text-[16px] leading-7 text-[#686157]">
        Start generating AI-powered shorts with queue-safe automation.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#686157]">Display name</span>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your creator brand"
            required
          />
        </label>

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
            placeholder="Minimum 8 characters"
            minLength={8}
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
              <Spinner className="h-4 w-4 border-white border-r-transparent" /> Creating account…
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="mt-6 text-[14px] text-[#686157]">
        Already have an account?{" "}
        <Link className="font-medium text-[#11100e] underline decoration-[#c9ff4a] decoration-4 underline-offset-4" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
