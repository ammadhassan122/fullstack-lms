"use client";

import Link from "next/link";
import { Play, CheckCircle2, Circle, BookOpen } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import type { COURSE_WITH_MODULES_QUERY_RESULT } from "@/sanity.types";

// Infer types from Sanity query result
type Module = NonNullable<
  NonNullable<COURSE_WITH_MODULES_QUERY_RESULT>["modules"]
>[number];
type Lesson = NonNullable<Module["lessons"]>[number];

interface ModuleAccordionProps {
  modules: Module[] | null;
  userId?: string | null;
}

export function ModuleAccordion({ modules, userId }: ModuleAccordionProps) {
  if (!modules || modules.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground kid-card">
        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50 text-sky-500" />
        <p className="font-medium">No modules available yet.</p>
      </div>
    );
  }

  const isLessonCompleted = (lesson: Lesson): boolean => {
    if (!userId || !lesson.completedBy) return false;
    return lesson.completedBy.includes(userId);
  };

  const getModuleProgress = (
    module: Module,
  ): { completed: number; total: number } => {
    const lessons = module.lessons ?? [];
    const total = lessons.length;
    const completed = lessons.filter((lesson: any) =>
      isLessonCompleted(lesson),
    ).length;
    return { completed, total };
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black mb-6 kid-gradient-text">Lessons</h2>

      <Accordion type="multiple" className="space-y-3">
        {modules.map((module, index) => {
          const { completed, total } = getModuleProgress(module);
          const isModuleComplete = total > 0 && completed === total;

          return (
            <AccordionItem
              key={module._id}
              value={module._id}
              className="border-2 border-border/80 rounded-2xl overflow-hidden bg-card/80 data-[state=open]:bg-pastel-sky/20"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-pastel-mint/30 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-200 text-sky-800 text-sm font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Module
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground">
                      {module.title ?? "Untitled Module"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">
                      {total} {total === 1 ? "lesson" : "lessons"}
                      {userId && total > 0 && (
                        <span className="ml-2">
                          • {completed}/{total} completed
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Progress bar */}
                  {userId && total > 0 && (
                    <div className="hidden sm:flex items-center gap-3 shrink-0 w-36">
                      <Progress
                        value={(completed / total) * 100}
                        className="flex-1 h-2 bg-pastel-sky/50 [&>div]:bg-teal-500"
                      />
                      <div className="w-5">
                        {isModuleComplete && (
                          <CheckCircle2 className="w-5 h-5 text-teal-500" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-4 pt-2">
                <div className="ml-4 border-l-2 border-sky-200 pl-3 space-y-1">
                  {module.lessons?.map((lesson: any, lessonIndex: any) => {
                    const completed = isLessonCompleted(lesson);
                    const hasVideo = !!lesson.video?.asset?.playbackId;

                    return (
                      <Link
                        key={lesson._id}
                        href={`/lessons/${lesson.slug!.current!}`}
                        className="flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-lg hover:bg-pastel-sky/40 transition-colors group"
                      >
                        {completed ? (
                          <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-sky-300 shrink-0" />
                        )}

                        <span
                          className={`flex-1 text-sm font-medium ${
                            completed
                              ? "text-muted-foreground"
                              : "text-foreground"
                          } group-hover:text-primary transition-colors`}
                        >
                          {lesson.title ?? "Untitled Lesson"}
                        </span>

                        {hasVideo && (
                          <Play className="w-4 h-4 text-sky-400 group-hover:text-teal-500 transition-colors" />
                        )}
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
  );
}
