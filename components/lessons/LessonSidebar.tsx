"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { LESSON_BY_ID_QUERY_RESULT } from "@/sanity.types";

// Infer types from Sanity query result
type Course = NonNullable<LESSON_BY_ID_QUERY_RESULT>["courses"][number];
type CourseModules = Course["modules"];
type Module = NonNullable<CourseModules>[number];
type Lesson = NonNullable<Module["lessons"]>[number];

interface LessonSidebarProps {
  courseSlug: string;
  courseTitle: string | null;
  modules: Module[] | null;
  currentLessonId: string;
  completedLessonIds?: string[];
}

export function LessonSidebar({
  courseSlug,
  courseTitle,
  modules,
  currentLessonId,
  completedLessonIds = [],
}: LessonSidebarProps) {
  if (!modules || modules.length === 0) {
    return null;
  }

  // Find which module contains the current lesson
  const currentModuleId = modules.find((m) =>
    m.lessons?.some((l: Lesson) => l._id === currentLessonId),
  )?._id;

  return (
    <div className="w-full lg:w-80 shrink-0">
      <div className="sticky top-24 kid-card overflow-hidden bg-white/90">
        {/* Course header */}
        <div className="p-4 border-b-2 border-sky-100 bg-pastel-sky/30">
          <Link
            href={`/courses/${courseSlug}`}
            className="text-sm font-semibold text-sky-700 hover:text-sky-900 transition-colors"
          >
            ← Back to course
          </Link>
          <h3 className="font-bold text-foreground mt-2 line-clamp-2 text-base">
            {courseTitle ?? "Course"}
          </h3>
        </div>

        {/* Modules and lessons */}
        <div className="max-h-[60vh] overflow-y-auto">
          <Accordion
            type="multiple"
            defaultValue={currentModuleId ? [currentModuleId] : []}
            className="w-full"
          >
            {modules.map((module, moduleIndex) => {
              const lessonCount = module.lessons?.length ?? 0;
              const completedCount =
                module.lessons?.filter((l: Lesson) =>
                  completedLessonIds.includes(l._id),
                ).length ?? 0;

              return (
                <AccordionItem
                  key={module._id}
                  value={module._id}
                  className="border-b-2 border-sky-100 last:border-b-0"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-pastel-mint/30 text-left">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-sky-200 text-sky-800 text-xs font-bold shrink-0">
                        {moduleIndex + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                            Module
                          </span>
                        </div>
                        <p className="font-bold text-sm text-foreground truncate mt-0.5">
                          {module.title ?? "Untitled Module"}
                        </p>
                        <p className="text-xs text-muted-foreground font-medium">
                          {completedCount}/{lessonCount} lessons
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pb-3 pt-1">
                    <div className="ml-4 border-l-2 border-sky-200 pl-3 space-y-1">
                      {module.lessons?.map((lesson: Lesson) => {
                        const isActive = lesson._id === currentLessonId;
                        const isCompleted = completedLessonIds.includes(
                          lesson._id,
                        );

                        return (
                          <Link
                            key={lesson._id}
                            href={`/lessons/${lesson.slug!.current!}`}
                            className={cn(
                              "flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-lg text-sm font-medium transition-colors",
                              isActive
                                ? "bg-sky-500 text-white shadow-sm"
                                : "text-foreground hover:bg-pastel-sky/50",
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2
                                className={cn(
                                  "w-4 h-4 shrink-0",
                                  isActive ? "text-white" : "text-teal-600",
                                )}
                              />
                            ) : isActive ? (
                              <Play className="w-4 h-4 shrink-0 fill-white text-white" />
                            ) : (
                              <Circle className="w-4 h-4 text-sky-300 shrink-0" />
                            )}
                            <span className="truncate">
                              {lesson.title ?? "Untitled Lesson"}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
