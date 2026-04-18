export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_620px_at_20%_-10%,rgba(99,102,241,0.32),transparent),radial-gradient(900px_560px_at_90%_0%,rgba(56,189,248,0.18),transparent),#09090b] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-5xl items-center justify-center">
        {children}
      </div>
    </div>
  );
}
