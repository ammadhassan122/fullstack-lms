import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookOpen, Sparkles, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { AppShell } from "@/components/AppShell";
import { CourseList } from "@/components/courses";
import { sanityFetch } from "@/sanity/lib/live";
import { DASHBOARD_COURSES_QUERY } from "@/sanity/lib/queries";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { data: courses = [] } = await sanityFetch({
    query: DASHBOARD_COURSES_QUERY,
    params: { userId: user.id },
  });

  const firstName = user.firstName ?? user.username ?? "friend";

  return (
    <AppShell>
      <Header />

      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Hi,{" "}
              <span className="kid-gradient-text">{firstName}</span>
              ! 👋
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pastel-yellow/80 border-2 border-amber-200 shrink-0">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-800">
                5th Grade Explorer
              </span>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl font-medium">
            Pick a class and keep learning! Every lesson is free and ready for
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="p-6 rounded-2xl kid-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-pastel-sky/80 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <p className="text-3xl font-black text-foreground">
                  {courses.length}
                </p>
                <p className="text-sm text-muted-foreground font-semibold">
                  Classes to explore
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl kid-card bg-gradient-to-br from-pastel-mint/60 to-pastel-sky/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  All lessons unlocked!
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  Math, English, and more — learn at your own pace.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black mb-6 kid-gradient-text">
            Your Classes
          </h2>
          <CourseList
            courses={courses}
            showSearch
            emptyMessage="No classes yet — ask your teacher to add some!"
          />
        </div>
      </main>
    </AppShell>
  );
}
