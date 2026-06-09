import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

/**
 * Cheerful layout wrapper for student-facing pages (5th grade LMS).
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Soft pastel gradient blobs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[-15%] left-[-8%] w-[520px] h-[520px] bg-sky-200/60 rounded-full blur-[100px]" />
        <div
          className="absolute bottom-[-12%] right-[-8%] w-[480px] h-[480px] bg-mint-200/50 rounded-full blur-[90px]"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[35%] right-[15%] w-[360px] h-[360px] bg-pastel-yellow/40 rounded-full blur-[80px]"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-[55%] left-[20%] w-[280px] h-[280px] bg-pastel-pink/35 rounded-full blur-[70px]"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      {/* Subtle dot pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.75 0.08 250 / 0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {children}
    </div>
  );
}
