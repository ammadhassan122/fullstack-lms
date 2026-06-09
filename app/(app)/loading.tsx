import { AppShell } from "@/components/AppShell";
import LoadingSpinner from "@/components/LoadingSpinner";

function Loading() {
  return (
    <AppShell>
      <div className="relative z-10">
        <LoadingSpinner text="Loading..." isFullScreen size="lg" />
      </div>
    </AppShell>
  );
}

export default Loading;
