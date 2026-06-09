import { AppShell } from "@/components/AppShell";
import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <AppShell>
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
        <Skeleton className="w-32 h-10 rounded-xl" />
        <Skeleton className="w-9 h-9 rounded-full" />
      </nav>
      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-7xl mx-auto space-y-8">
        <Skeleton className="h-8 w-40 rounded-lg" />
        <div className="flex flex-col lg:flex-row gap-8">
          <Skeleton className="w-full lg:w-80 h-52 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4 rounded-lg" />
            <Skeleton className="h-6 w-full rounded" />
            <Skeleton className="h-6 w-2/3 rounded" />
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </main>
    </AppShell>
  );
}

export default Loading;
