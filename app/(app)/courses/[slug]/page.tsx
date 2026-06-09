import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/Header";
import { AppShell } from "@/components/AppShell";
import { CourseContent } from "@/components/courses";
import { sanityFetch } from "@/sanity/lib/live";
import { COURSE_WITH_MODULES_QUERY } from "@/sanity/lib/queries";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const { userId } = await auth();

  const { data: course } = await sanityFetch({
    query: COURSE_WITH_MODULES_QUERY,
    params: { slug, userId: userId },
  });

  if (!course) {
    notFound();
  }

  return (
    <AppShell>
      <Header />
      <main className="relative z-10 px-6 lg:px-12 py-12 max-w-7xl mx-auto">
        <CourseContent course={course} userId={userId} />
      </main>
    </AppShell>
  );
}
