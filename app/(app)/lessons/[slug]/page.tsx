import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/Header";
import { AppShell } from "@/components/AppShell";
import { LessonPageContent } from "@/components/lessons";
import { sanityFetch } from "@/sanity/lib/live";
import { LESSON_BY_SLUG_QUERY } from "@/sanity/lib/queries";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const { userId } = await auth();

  const { data: lesson } = await sanityFetch({
    query: LESSON_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!lesson) {
    notFound();
  }

  return (
    <AppShell>
      <Header />
      <main className="relative z-10 px-6 lg:px-12 py-8 max-w-7xl mx-auto">
        <LessonPageContent lesson={lesson as any} userId={userId} />
      </main>
    </AppShell>
  );
}
