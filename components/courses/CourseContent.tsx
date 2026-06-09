"use client";

import { useAuth } from "@clerk/nextjs";
import { CourseHero } from "./CourseHero";
import { ModuleAccordion } from "./ModuleAccordion";
import { CourseCompleteButton } from "./CourseCompleteButton";
import type { COURSE_WITH_MODULES_QUERY_RESULT } from "@/sanity.types";
import { Skeleton } from "../ui/skeleton";

interface CourseContentProps {
  course: NonNullable<COURSE_WITH_MODULES_QUERY_RESULT>;
  userId: string | null;
}

export function CourseContent({ course, userId }: CourseContentProps) {
  const { isLoaded: isAuthLoaded } = useAuth();

  let totalLessons = 0;
  let completedLessons = 0;

  for (const m of course.modules ?? []) {
    for (const l of m.lessons ?? []) {
      totalLessons++;
      if (userId && l.completedBy?.includes(userId)) {
        completedLessons++;
      }
    }
  }

  const isCourseCompleted = userId
    ? (course.completedBy?.includes(userId) ?? false)
    : false;

  if (!isAuthLoaded) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <>
      <CourseHero
        title={course.title}
        description={course.description ?? null}
        thumbnail={course.thumbnail}
        category={course.category}
        moduleCount={course.moduleCount}
        lessonCount={course.lessonCount}
      />

      <div className="space-y-8">
        {userId && (
          <CourseCompleteButton
            courseId={course._id}
            courseSlug={course.slug!.current!}
            isCompleted={isCourseCompleted}
            completedLessons={completedLessons}
            totalLessons={totalLessons}
          />
        )}

        <ModuleAccordion modules={course.modules ?? null} userId={userId} />
      </div>
    </>
  );
}
