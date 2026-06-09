import { AppShell } from "@/components/AppShell";
import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <AppShell>
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex flex-col gap-1">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-12 h-2" />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Skeleton className="w-28 h-9 rounded-xl" />
          <Skeleton className="w-28 h-9 rounded-xl" />
        </div>
        <Skeleton className="w-9 h-9 rounded-full" />
      </nav>

      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <Skeleton className="h-12 w-80 rounded-xl mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {["c1", "c2", "c3", "c4", "c5", "c6"].map((id) => (
            <Skeleton key={id} className="h-64 rounded-2xl" />
          ))}
        </div>
      </main>
    </AppShell>
  );
}

export default Loading;
