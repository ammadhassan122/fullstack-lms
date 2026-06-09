import { AppShell } from "@/components/AppShell";
import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <AppShell>
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
        <Skeleton className="w-32 h-10 rounded-xl" />
        <Skeleton className="w-9 h-9 rounded-full" />
      </nav>
      <main className="relative z-10 px-6 lg:px-12 py-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-80 rounded-2xl hidden lg:block" />
        </div>
      </main>
    </AppShell>
  );
}

export default Loading;
