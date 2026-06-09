import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookOpen } from "lucide-react";
import { Header } from "@/components/Header";
import { AppShell } from "@/components/AppShell";
import { CourseCard } from "@/components/courses";
import { sanityFetch } from "@/sanity/lib/live";
import { DASHBOARD_COURSES_QUERY } from "@/sanity/lib/queries";

export default async function MyCoursesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { data: courses } = await sanityFetch({
    query: DASHBOARD_COURSES_QUERY,
    params: { userId: user.id },
  });

  type Course = (typeof courses)[number];
  type CourseWithProgress = Course & {
    totalLessons: number;
    completedLessons: number;
  };

  const startedCourses = courses.reduce<CourseWithProgress[]>((acc, course) => {
    const { total, completed } = (course.modules ?? []).reduce(
      (stats, m) =>
        (m.lessons ?? []).reduce(
          (s, l) => ({
            total: s.total + 1,
            completed: s.completed + (l.completedBy?.includes(user.id) ? 1 : 0),
          }),
          stats,
        ),
      { total: 0, completed: 0 },
    );

    if (completed > 0) {
      acc.push({ ...course, totalLessons: total, completedLessons: completed });
    }
    return acc;
  }, []);

  return (
    <AppShell>
      <Header />

      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2 kid-gradient-text">
            My Classes
          </h1>
          <p className="text-muted-foreground font-medium">
            Classes you&apos;ve started — pick up where you left off!
          </p>
        </div>

        {startedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startedCourses.map((course) => (
              <CourseCard
                key={course.slug!.current!}
                slug={{ current: course.slug!.current! }}
                title={course.title}
                description={course.description}
                tier={course.tier}
                thumbnail={course.thumbnail}
                moduleCount={course.moduleCount}
                lessonCount={course.totalLessons}
                completedLessonCount={course.completedLessons}
                isCompleted={course.completedBy?.includes(user.id) ?? false}
                showProgress
                subjectHint={course.category?.title ?? undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 kid-card">
            <div className="w-16 h-16 rounded-2xl bg-pastel-sky/80 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">No classes started yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto font-medium">
              Visit your desk and open a class. Your progress will show up here
              after your first lesson!
            </p>
          </div>
        )}
      </main>
    </AppShell>
  );
}
