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
    <div className="rounded-[18px] border border-[#e0e0e0] bg-white p-8">
      <p className="text-[12px] font-normal tracking-[-0.12px] text-[#0066cc]">AutoShorts AI</p>

      <h1 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-[-0.374px] text-[#1d1d1f]">
        Create your workspace.
      </h1>
      <p className="mt-2 text-[17px] leading-[1.47] tracking-[-0.374px] text-[#7a7a7a]">
        Start generating AI-powered shorts with queue-safe automation.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-1.5">
          <span className="text-[14px] font-semibold tracking-[-0.224px] text-[#1d1d1f]">Display name</span>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your creator brand"
            required
          />
        </label>

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
            placeholder="Minimum 8 characters"
            minLength={8}
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
              <Spinner className="h-4 w-4 border-white border-r-transparent" /> Creating account…
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="mt-6 text-[14px] tracking-[-0.224px] text-[#7a7a7a]">
        Already have an account?{" "}
        <Link className="text-[#0066cc] hover:underline" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
