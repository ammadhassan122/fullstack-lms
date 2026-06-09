"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const courses = (lesson.courses ?? []) as LessonCourse[];
  const activeCourse = courses[0];

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
      {activeCourse && (
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
        {activeCourse ? (
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
                <h1 className="text-2xl md:text-3xl font-black mb-2 kid-gradient-text">
                  {lesson.title ?? "Untitled Lesson"}
                </h1>
                {lesson.description && (
                  <p className="text-muted-foreground font-medium text-base">
                    {lesson.description}
                  </p>
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
              <div className="kid-card bg-gradient-to-br from-pastel-sky/50 via-white/90 to-pastel-mint/30 p-6 md:p-8 mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-sky-600" />
                  <h2 className="text-lg font-bold text-foreground">Lesson Notes</h2>
                </div>
                <LessonContent content={lesson.content} />
              </div>
            )}

            <div className="kid-card bg-gradient-to-br from-pastel-yellow/40 via-white/90 to-pastel-mint/25 p-6 md:p-8 mb-6 fade-up">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-foreground">Lesson Task</h2>
              </div>

              {lesson.taskDescription && lesson.taskDescription.length > 0 ? (
                <LessonContent content={lesson.taskDescription} />
              ) : (
                <p className="text-foreground/80 font-medium mb-4">
                  No task has been assigned for this lesson yet.
                </p>
              )}

              <form onSubmit={handleSubmitTask} className="space-y-4">
                <label
                  htmlFor="lesson-task"
                  className="block text-sm font-bold text-foreground"
                >
                  Your Solution
                </label>
                <textarea
                  id="lesson-task"
                  value={submission}
                  onChange={(event) => setSubmission(event.target.value)}
                  rows={8}
                  className="w-full rounded-2xl border-2 border-sky-200 bg-white p-4 text-base text-foreground placeholder:text-muted-foreground outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/40"
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
                  <div
                    className={`mt-4 rounded-2xl border-2 px-4 py-3 text-sm font-medium transition-all duration-300 sm:text-base ${
                      statusType === "success"
                        ? "border-teal-300 bg-pastel-mint/60 text-teal-900"
                        : "border-rose-300 bg-rose-50 text-rose-800"
                    }`}
                    aria-live="polite"
                  >
                    <p>{statusMessage}</p>
                  </div>
                )}
              </form>
            </div>

            {/* Navigation between lessons */}
            <div className="flex items-center justify-between pt-6 border-t-2 border-sky-200/80">
              {prevLesson ? (
                <Link href={`/lessons/${prevLesson.slug}`}>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground hover:bg-pastel-sky/50 font-semibold"
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
                  <Button className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold shadow-md shadow-sky-200/50">
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
          <p className="text-muted-foreground text-center py-12">
            This lesson is not linked to a course yet.
          </p>
        )}
      </div>
    </div>
  );
}
