"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GatedFallback } from "@/components/courses/GatedFallback";
import { useUserTier, hasTierAccess } from "@/lib/hooks/use-user-tier";
import { MuxVideoPlayer } from "./MuxVideoPlayer";
import { LessonContent } from "./LessonContent";
import { LessonCompleteButton } from "./LessonCompleteButton";
import { LessonSidebar } from "./LessonSidebar";
import type { LESSON_BY_ID_QUERY_RESULT } from "@/sanity.types";

type LessonCourse = NonNullable<LESSON_BY_ID_QUERY_RESULT>["courses"][number];

interface LessonPageContentProps {
  lesson: NonNullable<LESSON_BY_ID_QUERY_RESULT>;
  userId: string | null;
}

export function LessonPageContent({ lesson, userId }: LessonPageContentProps) {
  const userTier = useUserTier();

  // Find the first course the user has access to (courses are sorted by tier: free, pro, ultra)
  // This allows users to access lessons if they have access to ANY course containing the lesson
  const courses = (lesson.courses ?? []) as LessonCourse[];
  const accessibleCourse = courses.find((course) =>
    hasTierAccess(userTier, course.tier),
  );
  const hasAccess = !!accessibleCourse;

  const [submission, setSubmission] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  async function handleSubmitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId) {
      setStatusType("error");
      setStatusMessage("Please sign in to submit your task.");
      return;
    }

    const trimmedSubmission = submission.trim();
    if (!trimmedSubmission) {
      setStatusType("error");
      setStatusMessage("Please type your answer before submitting.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    setStatusType(null);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId: lesson._id,
          submission: trimmedSubmission,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message ?? "Unable to submit task.");
      }

      setStatusType("success");
      setStatusMessage(result.message ?? "Task Submitted Successfully!");
      setSubmission("");
    } catch (error) {
      setStatusType("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your task.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Use the accessible course for navigation, or fall back to the first course for gated fallback
  const activeCourse = accessibleCourse ?? courses[0];

  // Check if user has completed this lesson
  const isCompleted = userId
    ? (lesson.completedBy?.includes(userId) ?? false)
    : false;

  // Find previous and next lessons for navigation
  const modules = activeCourse?.modules;
  let prevLesson: { id: string; slug: string; title: string } | null = null;
  let nextLesson: { id: string; slug: string; title: string } | null = null;
  const completedLessonIds: string[] = [];

  const playbackId =
    lesson.video?.asset?.playbackId ??
    (lesson.video?.asset?.data as { playback_ids?: Array<{ id?: string }> })
      ?.playback_ids?.[0]?.id;

  // Debug logging
  if (typeof window !== "undefined") {
    console.log("DEBUG - Playback ID from lesson data:", {
      playbackId,
      videoAsset: lesson.video?.asset,
      fullPath: lesson.video?.asset?.playbackId,
    });
  }

  if (modules) {
    const allLessons: Array<{ id: string; slug: string; title: string }> = [];

    for (const lessonModule of modules) {
      if (lessonModule.lessons) {
        for (const l of lessonModule.lessons) {
          allLessons.push({
            id: l._id,
            slug: l.slug!.current!,
            title: l.title ?? "Untitled Lesson",
          });
          if (userId && l.completedBy?.includes(userId)) {
            completedLessonIds.push(l._id);
          }
        }
      }
    }

    const currentIndex = allLessons.findIndex((l) => l.id === lesson._id);
    prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    nextLesson =
      currentIndex < allLessons.length - 1
        ? allLessons[currentIndex + 1]
        : null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      {activeCourse && hasAccess && (
        <LessonSidebar
          courseSlug={activeCourse.slug!.current!}
          courseTitle={activeCourse.title}
          modules={activeCourse.modules ?? null}
          currentLessonId={lesson._id}
          completedLessonIds={completedLessonIds}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 min-w-0">
        {hasAccess ? (
          <>
            {/* Video Player */}
            {playbackId && (
              <MuxVideoPlayer
                playbackId={playbackId}
                title={lesson.title ?? undefined}
                className="mb-6"
              />
            )}

            {/* Lesson Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {lesson.title ?? "Untitled Lesson"}
                </h1>
                {lesson.description && (
                  <p className="text-zinc-400">{lesson.description}</p>
                )}
              </div>

              {userId && (
                <LessonCompleteButton
                  lessonId={lesson._id}
                  lessonSlug={lesson.slug!.current!}
                  isCompleted={isCompleted}
                />
              )}
            </div>

            {/* Lesson Content */}
            {lesson.content && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8 mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-violet-400" />
                  <h2 className="text-lg font-semibold">Lesson Notes</h2>
                </div>
                <LessonContent content={lesson.content} />
              </div>
            )}

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8 mb-6 fade-up">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold">Lesson Task</h2>
              </div>

              {lesson.taskDescription && lesson.taskDescription.length > 0 ? (
                <LessonContent content={lesson.taskDescription} />
              ) : (
                <p className="text-zinc-400 mb-4">
                  No task has been assigned for this lesson yet.
                </p>
              )}

              <form onSubmit={handleSubmitTask} className="space-y-4">
                <label htmlFor="lesson-task" className="block text-sm font-medium text-zinc-200">
                  Your Solution
                </label>
                <textarea
                  id="lesson-task"
                  value={submission}
                  onChange={(event) => setSubmission(event.target.value)}
                  rows={8}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-950/60 p-4 text-sm text-white outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  placeholder="Type your solution or answer here..."
                  disabled={isSubmitting}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !submission.trim()}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Task"}
                  </Button>
                </div>
                {statusMessage && (
                  <div className="mt-4 rounded-2xl border px-4 py-3 text-sm transition-all duration-300 sm:text-base"
                    aria-live="polite"
                  >
                    <p
                      className={
                        statusType === "success"
                          ? "text-emerald-300"
                          : "text-rose-300"
                      }
                    >
                      {statusMessage}
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* Navigation between lessons */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
              {prevLesson ? (
                <Link href={`/lessons/${prevLesson.slug}`}>
                  <Button
                    variant="ghost"
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{prevLesson.title}</span>
                    <span className="sm:hidden">Previous</span>
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link href={`/lessons/${nextLesson.slug}`}>
                  <Button className="bg-violet-600 hover:bg-violet-500 text-white">
                    <span className="hidden sm:inline">{nextLesson.title}</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </>
        ) : (
          <GatedFallback requiredTier={activeCourse?.tier} />
        )}
      </div>
    </div>
  );
}
